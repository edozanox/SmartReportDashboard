import { ReportStatus } from '@/models/report-status.enum'
import type { LngLat } from 'mapbox-gl';

export class Report {
  public id: number;
  public categoria: string;
  public indirizzo: string;
  public descrizione: string;
  public coordinate: LngLat;
  public data_inserimento: Date;
  public data_aggiornamento: Date | null;
  public id_gruppo: number | null;
  public status: ReportStatus | null;
  public email: string;
  public telefono: string;
  public annotazioni: string | null;

  constructor(
    id: number,
    categoria: string,
    indirizzo: string,
    descrizione: string,
    coordinate: LngLat,
    data_inserimento: Date,
    data_aggiornamento: Date | null,
    id_gruppo: number | null,
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
    this.id_gruppo = id_gruppo;
    this.status = status;
    this.email = email;
    this.telefono = telefono;
    this.annotazioni = annotazioni;
  }
}