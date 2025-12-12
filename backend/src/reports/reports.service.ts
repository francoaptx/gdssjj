import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoutingSheet } from '../routing-sheets/entities/routing-sheet.entity';
import { User } from '../users/entities/user.entity';
import { Office } from '../offices/entities/office.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(RoutingSheet)
    private routingSheetsRepository: Repository<RoutingSheet>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Office)
    private officesRepository: Repository<Office>,
  ) {}

  async generateRoutingSheetReport(userId: number): Promise<string> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const routingSheets = await this.routingSheetsRepository.find({
      where: [
        { sender: { id: userId } },
        { recipient: { id: userId } }
      ],
      order: { createdAt: 'DESC' }
    });

    let html = `
      <h1>Reporte de Hojas de Ruta para ${user.name}</h1>
      <p><strong>Usuario:</strong> ${user.username}</p>
      <p><strong>Oficina:</strong> ${user.office?.name || 'N/A'}</p>
      <p><strong>Rol:</strong> ${user.role?.name || 'N/A'}</p>
      <p><strong>Total de Hojas de Ruta:</strong> ${routingSheets.length}</p>
      <hr>
    `;

    routingSheets.forEach(rs => {
      const createdAt = new Date(rs.createdAt).toLocaleDateString();
      const receivedAt = rs.receivedAt ? new Date(rs.receivedAt).toLocaleDateString() : 'N/A';
      const processedAt = rs.processedAt ? new Date(rs.processedAt).toLocaleDateString() : 'N/A';
      const archivedAt = rs.archivedAt ? new Date(rs.archivedAt).toLocaleDateString() : 'N/A';
      const cancelledAt = rs.cancelledAt ? new Date(rs.cancelledAt).toLocaleDateString() : 'N/A';

      html += `
        <div style="border: 1px solid #ccc; margin: 10px; padding: 10px;">
          <h3>Hojas de Ruta: ${rs.number}</h3>
          <p><strong>Fecha de Creación:</strong> ${createdAt}</p>
          <p><strong>Remitente:</strong> ${rs.sender?.name || 'N/A'}</p>
          <p><strong>Destinatario:</strong> ${rs.recipient?.name || 'N/A'}</p>
          <p><strong>Referencia:</strong> ${rs.reference}</p>
          <p><strong>Providencia:</strong> ${rs.provision}</p>
          <p><strong>Cantidad de Hojas:</strong> ${rs.numberOfPages || 'N/A'}</p>
          <p><strong>Número de Anexos:</strong> ${rs.numberOfAttachments || 'N/A'}</p>
          <p><strong>Prioridad:</strong> ${rs.priority}</p>
          <p><strong>Tiene Cite:</strong> ${rs.hasCite ? 'Sí' : 'No'}</p>
          <p><strong>Fecha de Recepción:</strong> ${receivedAt}</p>
          <p><strong>Fecha de Procesamiento:</strong> ${processedAt}</p>
          <p><strong>Fecha de Archivado:</strong> ${archivedAt}</p>
          <p><strong>Fecha de Cancelación:</strong> ${cancelledAt}</p>
          <p><strong>Estado:</strong> ${rs.status}</p>
        </div>
      `;
    });

    return html;
  }

  async generateOfficePerformanceReport(): Promise<string> {
    const offices = await this.officesRepository.find();
    const allRoutingSheets = await this.routingSheetsRepository.find({
      order: { createdAt: 'DESC' }
    });

    let html = '<h1>Reporte de Rendimiento por Oficina</h1>';

    offices.forEach(office => {
      const officeSheets = allRoutingSheets.filter(rs => 
        rs.sender?.office?.id === office.id || rs.recipient?.office?.id === office.id
      );

      const pendingCount = officeSheets.filter(rs => rs.status === 'PENDING').length;
      const receivedCount = officeSheets.filter(rs => rs.status === 'RECEIVED').length;
      const processedCount = officeSheets.filter(rs => rs.status === 'PROCESSED').length;
      const archivedCount = officeSheets.filter(rs => rs.status === 'ARCHIVED').length;
      const cancelledCount = officeSheets.filter(rs => rs.status === 'CANCELLED').length;

      html += `
        <div style="border: 1px solid #ccc; margin: 10px; padding: 10px;">
          <h2>${office.name}</h2>
          <p><strong>Total de Hojas de Ruta:</strong> ${officeSheets.length}</p>
          <p><strong>Pendientes:</strong> ${pendingCount}</p>
          <p><strong>Recibidas:</strong> ${receivedCount}</p>
          <p><strong>Procesadas:</strong> ${processedCount}</p>
          <p><strong>Archivadas:</strong> ${archivedCount}</p>
          <p><strong>Canceladas:</strong> ${cancelledCount}</p>
        </div>
      `;
    });

    return html;
  }

  async generateStatisticsReport(): Promise<any> {
    const totalRoutingSheets = await this.routingSheetsRepository.count();
    const totalUsers = await this.usersRepository.count();
    const totalOffices = await this.officesRepository.count();

    const statusStats = await this.routingSheetsRepository
      .createQueryBuilder('rs')
      .select('rs.status', 'status')
      .addSelect('COUNT(rs.id)', 'count')
      .groupBy('rs.status')
      .getRawMany();

    const recentActivity = await this.routingSheetsRepository.find({
      order: { createdAt: 'DESC' },
      take: 10
    });

    return {
      totalRoutingSheets,
      totalUsers,
      totalOffices,
      statusStats,
      recentActivity
    };
  }
}