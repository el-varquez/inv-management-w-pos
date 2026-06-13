using MediatR;

namespace POS.Application.Items.Queries.GetItems;

public record GetItemsQuery : IRequest<IList<ItemDto>>;

public record ItemDto(
    Guid Id,
    string Name,
    string? Description,
    string? Sku,
    decimal CostPrice,
    decimal SellingPrice,
    int Stock,
    int LowStockThreshold,
    bool IsLowStock,
    bool IsActive,
    Guid CategoryId,
    string CategoryName,
    DateTime CreatedAt
);