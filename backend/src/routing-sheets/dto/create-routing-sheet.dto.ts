export class CreateRoutingSheetDto {
  reference: string;
  provision: string;
  date: Date;
  attachments?: string;
  recipientId: number;
  citeId?: number;
  numberOfPages?: number;
  numberOfAttachments?: number;
  priority?: string;
}