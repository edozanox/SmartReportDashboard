import { ReportStatus } from '@/models/report-status.enum'
import type { LngLat } from 'mapbox-gl';
import type { CategoriaEnum } from './categoria.enum';

export class Report {
  public id: string;
  public categoria: CategoriaEnum;
  public indirizzo: string;
  public descrizione: string;
  public coordinate: LngLat;
  public data_inserimento: Date;
  public data_aggiornamento: Date | null;
  public id_gruppo: number | null;
  public stato: ReportStatus | null;
  public email: string;
  public telefono: string;
  public annotazioni: string | null;

  constructor(
    id: string,
    categoria: CategoriaEnum,
    indirizzo: string,
    descrizione: string,
    coordinate: LngLat,
    data_inserimento: Date,
    data_aggiornamento: Date | null,
    id_gruppo: number | null,
    stato: ReportStatus | null,
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
    this.stato = stato;
    this.email = email;
    this.telefono = telefono;
    this.annotazioni = annotazioni;
  }
}