import { useState, useMemo } from "react";
import { ordenacao, tipoOrdenacao } from "@/lib/ordenecao"; 

export function useOrdenacao<T>(
    dadosIniciais: T[],
    ordenacaoPadrao: tipoOrdenacao,
    dataChave: keyof T,
    labelChave: keyof T,
    vistoChave: keyof T
) {
    const [ordenarPor, setOrdenarPor] = useState<tipoOrdenacao>(ordenacaoPadrao);
    const [direcao, setDirecao] = useState<'asc' | 'desc'>('asc');

    const handleSort = (novaOrdenacao: tipoOrdenacao) => {
        if (ordenarPor === novaOrdenacao) {
            setDirecao((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setOrdenarPor(novaOrdenacao);
            setDirecao('asc');
        }
    };

    const dadosOrdenados = useMemo(() => {
        return ordenacao(dadosIniciais, ordenarPor, dataChave, labelChave, vistoChave, direcao);
    }, [dadosIniciais, ordenarPor, direcao, dataChave, labelChave, vistoChave]);

    return {
        dadosOrdenados,
        ordenarPor,
        direcao,
        handleSort
    };
}