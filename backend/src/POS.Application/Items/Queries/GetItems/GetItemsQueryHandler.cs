using MediatR;
using POS.Domain.Interfaces;

namespace POS.Application.Items.Queries.GetItems;

public class GetItemsQueryHandler : IRequestHandler<GetItemsQuery, IList<ItemDto>>
{
    private readonly IItemRepository _itemRepository;

    public GetItemsQueryHandler(IItemRepository itemRepository)
        => _itemRepository = itemRepository;    

    public async Task<IList<ItemDto>> Handle(GetItemsQuery request, CancellationToken ct)
    {
        var items = await _itemRepository.GetAllAsync(ct);

        return items.Select(i => new ItemDto(
            i.Id,
            i.Name,
            i.Description,
            i.Sku,
            i.CostPrice,
            i.SellingPrice,
            i.Stock,
            i.LowStockThreshold,
            i.Stock <= i.LowStockThreshold,
            i.IsActive,
            i.CategoryId,
            i.Category.Name,
            i.CreatedAt
        )).ToList();
    }
}