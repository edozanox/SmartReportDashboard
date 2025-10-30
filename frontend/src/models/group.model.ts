import { ReportStatus } from '@/models/report-status.enum'
import type { LngLat } from 'mapbox-gl';

export class Group {
  public id: number;
  public codice: string;
  public nome: string;
  public segnalazioniAssociate: number; 

  constructor(
    id: number,
    codice: string,
    nome: string,
    segnalazioniAssociate: number,   
  ) {
    this.id = id;
    this.codice = codice;
    this.nome = nome;
    this.segnalazioniAssociate = segnalazioniAssociate
  }
}
