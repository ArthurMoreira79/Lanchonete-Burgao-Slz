package com.burgaoslz.controller;

import com.burgaoslz.dto.PedidoRequestDTO;
import com.burgaoslz.model.Pedido;
import com.burgaoslz.service.PedidoService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public Pedido criar(@RequestBody PedidoRequestDTO requisicao) {
        return pedidoService.criarPedido(requisicao.getItens());
    }
}
