package com.burgaoslz.service;

import com.burgaoslz.model.ItemPedido;
import com.burgaoslz.model.Pedido;
import com.burgaoslz.repository.PedidoRepository;
import com.burgaoslz.repository.ProdutoRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.burgaoslz.dto.ItemPedidoDTO;
import com.burgaoslz.model.Produto;
import org.springframework.stereotype.Service;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;

    public PedidoService(PedidoRepository pedidoRepository, ProdutoRepository produtoRepository){
        this.pedidoRepository = pedidoRepository;
        this.produtoRepository = produtoRepository;
    }

    public Pedido criarPedido(List<ItemPedidoDTO> itensRecebidos){
        Pedido pedido = new Pedido();
        pedido.setDataHora(LocalDateTime.now());

        BigDecimal total = BigDecimal.ZERO;
        for (ItemPedidoDTO dto : itensRecebidos) {
            Produto produto = produtoRepository.findById(dto.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setProduto(produto);
            item.setQuantidade(dto.getQuantidade());
            item.setPrecoUnitario(produto.getPreco());
            pedido.getItens().add(item);

            total = total.add(produto.getPreco().multiply(BigDecimal.valueOf(dto.getQuantidade())));
        }
        pedido.setTotal(total);
        return pedidoRepository.save(pedido);
    }
}
