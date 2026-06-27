using MediatR;

namespace POS.Application.Profile.Commands.UpdateProfile;

public record UpdateProfileCommand(string Name) : IRequest;
