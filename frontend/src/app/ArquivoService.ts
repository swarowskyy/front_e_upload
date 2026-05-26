import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArquivoService {
  // 1. Injeta o cliente HTTP do Angular para podermos fazer requisições
  private http = inject(HttpClient);

  // 2. ADICIONE A SUA URL AQUI:
  private apiUrl = 'http://localhost:3000/arquivo'; 

  // Função para listar os arquivos (GET http://localhost:3000/arquivo)
  listarArquivos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Função para enviar o arquivo (POST http://localhost:3000/arquivo/upload)
  enviarArquivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // O nome 'file' deve ser o mesmo que o NestJS espera no @UploadedFile()
    
    // Usamos a crase ( ` ) para poder juntar a variável apiUrl com o texto /upload
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  // Função para deletar o arquivo (DELETE http://localhost:3000/arquivo/nome/nome-do-arquivo.png)
  removerArquivo(filename: string): Observable<any> {
    // Usamos a crase ( ` ) para passar o nome do arquivo na URL
    return this.http.delete(`${this.apiUrl}/nome/${filename}`);
  }
}