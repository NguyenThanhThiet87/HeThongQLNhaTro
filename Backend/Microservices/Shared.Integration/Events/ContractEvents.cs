namespace Shared.Integration.Events;

public interface IContractCreatedEvent
{
    int ContractId { get; set; }
    int RoomId { get; set; }
    int TenantId { get; set; }
    DateTime StartDate { get; set; }
    DateTime EndDate { get; set; }
}
