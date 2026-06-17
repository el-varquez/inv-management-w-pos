using MediatR;
using POS.Domain.Interfaces;

namespace POS.Application.Sales.Queries.GetTransactions;

public class GetTransactionsQueryHandler
    : IRequestHandler<GetTransactionsQuery, IList<TransactionDto>>
{
    private readonly ITransactionRepository _transactionRepository;

    public GetTransactionsQueryHandler(ITransactionRepository transactionRepository)
        => _transactionRepository = transactionRepository;

    public async Task<IList<TransactionDto>> Handle(
        GetTransactionsQuery request, CancellationToken ct)
    {
        var transactions = await _transactionRepository.GetAllAsync(
            request.From, request.To, ct);

        return transactions.Select(t => new TransactionDto(
            t.Id,
            t.ReceiptNumber,
            t.Subtotal,
            t.DiscountAmount,
            t.Total,
            t.PaymentType.ToString(),
            t.AmountTendered,
            t.Change,
            t.IsRefunded,
            t.RefundedFromId,
            t.Items.Count,
            t.CreatedAt
        )).ToList();
    }
}