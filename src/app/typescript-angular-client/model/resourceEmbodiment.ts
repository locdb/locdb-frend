/**
 * LOC-DB Central Component
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { Scan } from './scan';


export interface ResourceEmbodiment {
    type?: string;
    format?: string;
    firstPage?: number;
    lastPage?: number;
    url?: string;
    scans?: Array<Scan>;
}