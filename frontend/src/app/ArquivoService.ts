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

  // URL onde os arquivos estáticos ficam acessíveis para as miniaturas
  // IMPORTANTE: Ajuste esta URL se o seu NestJS usar outro caminho (ex: http://localhost:3000/static/)
  private staticUrl = 'http://localhost:3000/uploads/';


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

  constructor(private http: HttpClient) { }

  // 1. Envio de Arquivo (POST /arquivo/upload)
  upload(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  // 2. Listar Arquivos (GET /arquivo)
  listar(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // 3. Remover arquivo por nome (DELETE /arquivo/nome/:filename)
  remover(filename: string): Observable<any> {

    return this.http.delete(`${this.apiUrl}/nome/${filename}`);
  }

  // Retorna a URL completa para ser usada na tag <img src="..."> da miniatura
  getUrlPreview(filename: string): string {
    return `${this.staticUrl}${filename}`;
  }

  // Realiza o download seguro buscando o arquivo como Blob
  download(filename: string): Observable<Blob> {
    // Caso o backend não sirva arquivos estáticos diretamente, buscamos os bytes do arquivo
    return this.http.get(`${this.staticUrl}${filename}`, { responseType: 'blob' });
  }
}