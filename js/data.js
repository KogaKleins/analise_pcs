/* ===================================
   RS CONTABILIDADE - DADOS DOS PCS
   Arquivo de configuração dos computadores
   =================================== */

const pcsData = [
    {
        id: 1,
        nome: "PC-01",
        usuario: "Ariele",
        setor: "Administrativo",
        status: "ok", // ok, atencao, critico
        specs: {
            ram: {
                total: "8 GB",
                tipo: "DDR4",
                detalhe: "Dual Channel"
            },
            armazenamento: {
                tipo: "SSD SATA",
                capacidade: "447 GB",
                usado: "180 GB"
            },
            processador: {
                modelo: "Intel Core i5",
                geracao: "6ª Geração",
                nucleos: "4 núcleos",
                frequencia: "3.19 GHz"
            },
            sistemaOperacional: "Windows 10 Pro",
            placaMae: "-",
            gpu: "Intel HD Graphics 530"
        },
        observacoes: "Computador em bom estado de funcionamento. Performance adequada para tarefas de escritório.",
        recomendacoes: [
            "Manter atualização do Windows em dia",
            "Realizar limpeza de arquivos temporários mensalmente"
        ],
        links: {
            relatorio: "#",
            compraRam: "#",
            compraSSD: "#",
            compraProcessador: "#"
        }
    },
    {
        id: 2,
        nome: "PC-02",
        usuario: "A definir",
        setor: "Financeiro",
        status: "atencao",
        specs: {
            ram: {
                total: "4 GB",
                tipo: "DDR3",
                detalhe: "Single Channel"
            },
            armazenamento: {
                tipo: "HD",
                capacidade: "500 GB",
                usado: "320 GB"
            },
            processador: {
                modelo: "Intel Core i3",
                geracao: "4ª Geração",
                nucleos: "2 núcleos",
                frequencia: "2.5 GHz"
            },
            sistemaOperacional: "Windows 10",
            placaMae: "-",
            gpu: "Intel HD Graphics 4400"
        },
        observacoes: "Computador apresenta lentidão. Recomendado upgrade de memória RAM e troca do HD por SSD.",
        recomendacoes: [
            "Upgrade de memória RAM para 8GB",
            "Trocar HD por SSD",
            "Considerar atualização do processador"
        ],
        links: {
            relatorio: "#",
            compraRam: "#",
            compraSSD: "#",
            compraProcessador: "#"
        }
    },
    {
        id: 3,
        nome: "PC-03",
        usuario: "A definir",
        setor: "Contabilidade",
        status: "ok",
        specs: {
            ram: {
                total: "8 GB",
                tipo: "DDR4",
                detalhe: "Dual Channel"
            },
            armazenamento: {
                tipo: "SSD NVMe",
                capacidade: "256 GB",
                usado: "120 GB"
            },
            processador: {
                modelo: "Intel Core i5",
                geracao: "8ª Geração",
                nucleos: "6 núcleos",
                frequencia: "3.0 GHz"
            },
            sistemaOperacional: "Windows 11 Pro",
            placaMae: "-",
            gpu: "Intel UHD Graphics 630"
        },
        observacoes: "Excelente desempenho. Máquina atualizada e performática.",
        recomendacoes: [
            "Manter backups regulares",
            "Monitorar espaço em disco"
        ],
        links: {
            relatorio: "#",
            compraRam: "#",
            compraSSD: "#",
            compraProcessador: "#"
        }
    },
    {
        id: 4,
        nome: "PC-04",
        usuario: "A definir",
        setor: "Recursos Humanos",
        status: "critico",
        specs: {
            ram: {
                total: "2 GB",
                tipo: "DDR3",
                detalhe: "Single Channel"
            },
            armazenamento: {
                tipo: "HD",
                capacidade: "320 GB",
                usado: "280 GB"
            },
            processador: {
                modelo: "Intel Pentium",
                geracao: "2ª Geração",
                nucleos: "2 núcleos",
                frequencia: "2.0 GHz"
            },
            sistemaOperacional: "Windows 7",
            placaMae: "-",
            gpu: "Intel HD Graphics"
        },
        observacoes: "Máquina muito antiga. Sistema operacional sem suporte. Necessita substituição urgente.",
        recomendacoes: [
            "Substituição completa do equipamento",
            "Atualizar para Windows 10/11",
            "Fazer backup dos dados importantes"
        ],
        links: {
            relatorio: "#",
            compraRam: "#",
            compraSSD: "#",
            compraProcessador: "#"
        }
    },
    {
        id: 5,
        nome: "PC-05",
        usuario: "A definir",
        setor: "Recepção",
        status: "ok",
        specs: {
            ram: {
                total: "8 GB",
                tipo: "DDR4",
                detalhe: "Single Channel"
            },
            armazenamento: {
                tipo: "SSD SATA",
                capacidade: "240 GB",
                usado: "80 GB"
            },
            processador: {
                modelo: "Intel Core i3",
                geracao: "7ª Geração",
                nucleos: "2 núcleos",
                frequencia: "3.9 GHz"
            },
            sistemaOperacional: "Windows 10",
            placaMae: "-",
            gpu: "Intel HD Graphics 630"
        },
        observacoes: "Bom desempenho para tarefas básicas de recepção.",
        recomendacoes: [
            "Adicionar mais um pente de RAM para dual channel",
            "Manter sistema atualizado"
        ],
        links: {
            relatorio: "#",
            compraRam: "#",
            compraSSD: "#",
            compraProcessador: "#"
        }
    },
    {
        id: 6,
        nome: "PC-06",
        usuario: "A definir",
        setor: "Administrativo",
        status: "atencao",
        specs: {
            ram: {
                total: "4 GB",
                tipo: "DDR4",
                detalhe: "Single Channel"
            },
            armazenamento: {
                tipo: "SSD SATA",
                capacidade: "120 GB",
                usado: "95 GB"
            },
            processador: {
                modelo: "Intel Core i5",
                geracao: "6ª Geração",
                nucleos: "4 núcleos",
                frequencia: "2.7 GHz"
            },
            sistemaOperacional: "Windows 10",
            placaMae: "-",
            gpu: "Intel HD Graphics 530"
        },
        observacoes: "Memória RAM insuficiente e SSD quase cheio. Necessita upgrade.",
        recomendacoes: [
            "Upgrade de memória RAM para 8GB",
            "Trocar SSD por um de maior capacidade",
            "Realizar limpeza de disco"
        ],
        links: {
            relatorio: "#",
            compraRam: "#",
            compraSSD: "#",
            compraProcessador: "#"
        }
    },
    {
        id: 7,
        nome: "PC-07",
        usuario: "A definir",
        setor: "Contabilidade",
        status: "ok",
        specs: {
            ram: {
                total: "16 GB",
                tipo: "DDR4",
                detalhe: "Dual Channel"
            },
            armazenamento: {
                tipo: "SSD NVMe",
                capacidade: "512 GB",
                usado: "180 GB"
            },
            processador: {
                modelo: "Intel Core i7",
                geracao: "10ª Geração",
                nucleos: "8 núcleos",
                frequencia: "3.8 GHz"
            },
            sistemaOperacional: "Windows 11 Pro",
            placaMae: "-",
            gpu: "Intel UHD Graphics 630"
        },
        observacoes: "Máquina de alto desempenho. Ideal para tarefas pesadas.",
        recomendacoes: [
            "Manter drivers atualizados",
            "Realizar backup regular"
        ],
        links: {
            relatorio: "#",
            compraRam: "#",
            compraSSD: "#",
            compraProcessador: "#"
        }
    },
    {
        id: 8,
        nome: "PC-08",
        usuario: "A definir",
        setor: "Financeiro",
        status: "ok",
        specs: {
            ram: {
                total: "8 GB",
                tipo: "DDR4",
                detalhe: "Dual Channel"
            },
            armazenamento: {
                tipo: "SSD SATA",
                capacidade: "480 GB",
                usado: "220 GB"
            },
            processador: {
                modelo: "Intel Core i5",
                geracao: "7ª Geração",
                nucleos: "4 núcleos",
                frequencia: "3.4 GHz"
            },
            sistemaOperacional: "Windows 10 Pro",
            placaMae: "-",
            gpu: "Intel HD Graphics 630"
        },
        observacoes: "Bom estado geral. Atende bem às necessidades do setor.",
        recomendacoes: [
            "Considerar upgrade para 16GB RAM no futuro",
            "Manter antivírus atualizado"
        ],
        links: {
            relatorio: "#",
            compraRam: "#",
            compraSSD: "#",
            compraProcessador: "#"
        }
    },
    {
        id: 9,
        nome: "PC-09",
        usuario: "A definir",
        setor: "Administrativo",
        status: "atencao",
        specs: {
            ram: {
                total: "6 GB",
                tipo: "DDR3",
                detalhe: "Dual Channel"
            },
            armazenamento: {
                tipo: "HD",
                capacidade: "1 TB",
                usado: "650 GB"
            },
            processador: {
                modelo: "Intel Core i5",
                geracao: "4ª Geração",
                nucleos: "4 núcleos",
                frequencia: "3.2 GHz"
            },
            sistemaOperacional: "Windows 10",
            placaMae: "-",
            gpu: "Intel HD Graphics 4600"
        },
        observacoes: "HD apresenta lentidão. Memória DDR3 limitada.",
        recomendacoes: [
            "Substituir HD por SSD",
            "Avaliar upgrade de plataforma (placa-mãe + RAM DDR4)"
        ],
        links: {
            relatorio: "#",
            compraRam: "#",
            compraSSD: "#",
            compraProcessador: "#"
        }
    },
    {
        id: 10,
        nome: "PC-10",
        usuario: "A definir",
        setor: "Contabilidade",
        status: "ok",
        specs: {
            ram: {
                total: "8 GB",
                tipo: "DDR4",
                detalhe: "Dual Channel"
            },
            armazenamento: {
                tipo: "SSD SATA",
                capacidade: "256 GB",
                usado: "140 GB"
            },
            processador: {
                modelo: "Intel Core i5",
                geracao: "8ª Geração",
                nucleos: "6 núcleos",
                frequencia: "2.8 GHz"
            },
            sistemaOperacional: "Windows 10 Pro",
            placaMae: "-",
            gpu: "Intel UHD Graphics 630"
        },
        observacoes: "Funcionamento adequado. Sistema estável.",
        recomendacoes: [
            "Monitorar espaço em disco",
            "Considerar SSD maior se necessário"
        ],
        links: {
            relatorio: "#",
            compraRam: "#",
            compraSSD: "#",
            compraProcessador: "#"
        }
    },
    {
        id: 11,
        nome: "PC-11",
        usuario: "A definir",
        setor: "Recursos Humanos",
        status: "ok",
        specs: {
            ram: {
                total: "8 GB",
                tipo: "DDR4",
                detalhe: "Single Channel"
            },
            armazenamento: {
                tipo: "SSD NVMe",
                capacidade: "256 GB",
                usado: "90 GB"
            },
            processador: {
                modelo: "AMD Ryzen 5",
                geracao: "3ª Geração",
                nucleos: "6 núcleos",
                frequencia: "3.6 GHz"
            },
            sistemaOperacional: "Windows 11",
            placaMae: "-",
            gpu: "AMD Radeon Graphics"
        },
        observacoes: "Excelente desempenho com processador AMD moderno.",
        recomendacoes: [
            "Adicionar segundo pente RAM para dual channel",
            "Manter drivers AMD atualizados"
        ],
        links: {
            relatorio: "#",
            compraRam: "#",
            compraSSD: "#",
            compraProcessador: "#"
        }
    },
    {
        id: 12,
        nome: "PC-12",
        usuario: "A definir",
        setor: "Financeiro",
        status: "critico",
        specs: {
            ram: {
                total: "4 GB",
                tipo: "DDR2",
                detalhe: "Dual Channel"
            },
            armazenamento: {
                tipo: "HD",
                capacidade: "250 GB",
                usado: "200 GB"
            },
            processador: {
                modelo: "Intel Core 2 Duo",
                geracao: "Legado",
                nucleos: "2 núcleos",
                frequencia: "2.4 GHz"
            },
            sistemaOperacional: "Windows 7",
            placaMae: "-",
            gpu: "Intel GMA X4500"
        },
        observacoes: "Equipamento obsoleto. Sem suporte de segurança. Risco operacional.",
        recomendacoes: [
            "Substituição imediata do equipamento",
            "Migrar dados para máquina nova",
            "Não utilizar para dados sensíveis"
        ],
        links: {
            relatorio: "#",
            compraRam: "#",
            compraSSD: "#",
            compraProcessador: "#"
        }
    },
    {
        id: 13,
        nome: "PC-13",
        usuario: "A definir",
        setor: "Administrativo",
        status: "ok",
        specs: {
            ram: {
                total: "8 GB",
                tipo: "DDR4",
                detalhe: "Dual Channel"
            },
            armazenamento: {
                tipo: "SSD SATA",
                capacidade: "480 GB",
                usado: "160 GB"
            },
            processador: {
                modelo: "Intel Core i5",
                geracao: "9ª Geração",
                nucleos: "6 núcleos",
                frequencia: "2.9 GHz"
            },
            sistemaOperacional: "Windows 10 Pro",
            placaMae: "-",
            gpu: "Intel UHD Graphics 630"
        },
        observacoes: "Bom desempenho geral. Máquina bem configurada.",
        recomendacoes: [
            "Manter rotina de backup",
            "Atualizar para Windows 11 quando conveniente"
        ],
        links: {
            relatorio: "#",
            compraRam: "#",
            compraSSD: "#",
            compraProcessador: "#"
        }
    },
    {
        id: 14,
        nome: "PC-14",
        usuario: "A definir",
        setor: "Contabilidade",
        status: "atencao",
        specs: {
            ram: {
                total: "4 GB",
                tipo: "DDR4",
                detalhe: "Single Channel"
            },
            armazenamento: {
                tipo: "SSD SATA",
                capacidade: "240 GB",
                usado: "200 GB"
            },
            processador: {
                modelo: "Intel Core i3",
                geracao: "8ª Geração",
                nucleos: "4 núcleos",
                frequencia: "3.6 GHz"
            },
            sistemaOperacional: "Windows 10",
            placaMae: "-",
            gpu: "Intel UHD Graphics 630"
        },
        observacoes: "RAM insuficiente para uso intensivo. SSD quase cheio.",
        recomendacoes: [
            "Upgrade urgente de RAM para 8GB",
            "Liberar espaço ou trocar SSD",
            "Avaliar necessidade de processador mais potente"
        ],
        links: {
            relatorio: "#",
            compraRam: "#",
            compraSSD: "#",
            compraProcessador: "#"
        }
    },
    {
        id: 15,
        nome: "PC-15",
        usuario: "A definir",
        setor: "Recepção",
        status: "ok",
        specs: {
            ram: {
                total: "8 GB",
                tipo: "DDR4",
                detalhe: "Dual Channel"
            },
            armazenamento: {
                tipo: "SSD NVMe",
                capacidade: "256 GB",
                usado: "70 GB"
            },
            processador: {
                modelo: "Intel Core i3",
                geracao: "10ª Geração",
                nucleos: "4 núcleos",
                frequencia: "3.7 GHz"
            },
            sistemaOperacional: "Windows 11",
            placaMae: "-",
            gpu: "Intel UHD Graphics 630"
        },
        observacoes: "Máquina recente e bem configurada. Ideal para uso na recepção.",
        recomendacoes: [
            "Manter sistema atualizado",
            "Configurar backup automático"
        ],
        links: {
            relatorio: "#",
            compraRam: "#",
            compraSSD: "#",
            compraProcessador: "#"
        }
    }
];

// Exportar dados para uso global
window.pcsData = pcsData;
