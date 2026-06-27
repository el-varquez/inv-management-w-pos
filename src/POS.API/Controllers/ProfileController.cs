using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using POS.Application.Profile.Commands.ChangePassword;
using POS.Application.Profile.Commands.UpdateProfile;
using POS.Application.Profile.Queries.GetProfile;

namespace POS.API.Controllers;

[ApiController]
[Route("api/profile")]
[Authorize(Roles = "Admin")]
public class ProfileController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProfileController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> Get()
        => Ok(await _mediator.Send(new GetProfileQuery()));

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UpdateProfileCommand command)
    {
        await _mediator.Send(command);
        return NoContent();
    }

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordCommand command)
    {
        await _mediator.Send(command);
        return NoContent();
    }
}
