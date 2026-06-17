using MediatR;

namespace POS.Application.Sales.Queries.GetTransactions;

public record GetTransactionsQuery(
    DateTime? From,
    DateTime? To
) : IRequest<IList<TransactionDto>>;

public record TransactionDto(
    Guid Id,
    string ReceiptNumber,
    decimal Subtotal,
    decimal DiscountAmount,
    decimal Total,
    string PaymentType,
    decimal AmountTendered,
    decimal Change,
    bool IsRefunded,
    Guid? RefundedFromId,
    int ItemCount,
    DateTime CreatedAt
);