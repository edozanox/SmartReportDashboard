import { ReportStatus } from '@/models/report-status.enum'

export class Report {
  public id: number;
  public categoria: string;
  public indirizzo: string;
  public descrizione: string;
  public coordinate: string;
  public data_inserimento: Date;
  public data_aggiornamento: Date | null;
  public assegnatario: string | null;
  public status: ReportStatus | null;
  public email: string;
  public telefono: string;
  public annotazioni: string | null;

  constructor(
    id: number,
    categoria: string,
    indirizzo: string,
    descrizione: string,
    coordinate: string,
    data_inserimento: Date,
    data_aggiornamento: Date | null,
    assegnatario: string | null,
    status: ReportStatus | null,
    email: string,
    telefono: string,
    annotazioni: string | null
  ) {
    this.id = id;
    this.categoria = categoria;
    this.indirizzo = indirizzo;
    this.descrizione = descrizione;
    this.coordinate = coordinate;
    this.data_inserimento = data_inserimento;
    this.data_aggiornamento = data_aggiornamento;
    this.assegnatario = assegnatario;
    this.status = status;
    this.email = email;
    this.telefono = telefono;
    this.annotazioni = annotazioni;
  }
}