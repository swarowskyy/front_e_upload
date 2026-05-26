import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArquivoService } from './ArquivoService'; // Garanta que o nome do arquivo está idêntico

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  public fileService = inject(ArquivoService);
  
  // CORREÇÃO LINHA 15: Definimos a URL direto aqui para evitar o erro do 'this'
  public staticUrl = 'http://localhost:3000/uploads'; 

  arquivos: any[] = [];
  arquivoSelecionado: File | null = null;
  
  // Nova variável para a miniatura da prévia
  previsualizacaoLocal: string | ArrayBuffer | null = null; 
  
  mensagemSucesso: string = '';
  mensagemErro: string = '';

  ngOnInit() {
    this.carregarArquivos();
  }

  carregarArquivos() {
    // CORREÇÃO: Adicionamos ': any' na resposta para o TypeScript strict aceitar
    this.fileService.listarArquivos().subscribe({
      next: (resposta: any) => {
        // Mapeia os arquivos adicionando a URL da miniatura do servidor
        this.arquivos = resposta.files.map((arq: any) => ({
          ...arq,
          urlCompleta: `${this.staticUrl}/${arq.filename}`
        }));
      },
      error: () => {
        this.mensagemErro = 'Não foi possível carregar os arquivos.';
      }
    });
  }

  aoSelecionarArquivo(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.arquivoSelecionado = file;
      this.mensagemErro = '';
      this.mensagemSucesso = '';

      // LÓGICA DA PRÉVIA DA IMAGEM:
      const reader = new FileReader();
      reader.onload = () => {
        this.previsualizacaoLocal = reader.result; // Salva a prévia local
      };
      reader.readAsDataURL(file);
    }
  }

  fazerUpload() {
    if (!this.arquivoSelecionado) return;

    // CORREÇÃO: Adicionamos ': any' nos parâmetros do subscribe
    this.fileService.enviarArquivo(this.arquivoSelecionado).subscribe({
      next: (resposta: any) => {
        this.mensagemSucesso = resposta.message;
        this.limparSelecao();
        this.carregarArquivos();
      },
      error: (erro: any) => {
        this.mensagemErro = erro.error?.message || 'Erro inesperado ao fazer upload.';
      }
    });
  }

  limparSelecao() {
    this.arquivoSelecionado = null;
    this.previsualizacaoLocal = null;
  }

  deletar(filename: string) {
    // CORREÇÃO: Adicionamos ': any' nos parâmetros do subscribe
    this.fileService.removerArquivo(filename).subscribe({
      next: (resposta: any) => {
        this.mensagemSucesso = resposta.message;
        this.carregarArquivos();
      },
      error: (erro: any) => {
        this.mensagemErro = erro.error?.message || 'Arquivo não encontrado.';
      }
    });
  }
}
