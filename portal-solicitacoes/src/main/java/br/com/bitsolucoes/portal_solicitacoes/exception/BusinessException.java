package br.com.bitsolucoes.portal_solicitacoes.exception;

public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
