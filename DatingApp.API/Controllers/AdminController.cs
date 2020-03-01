using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;
        public AdminController(DataContext context, UserManager<User> userManager)
        {
            _userManager = userManager;
            _context = context;
        }


        [Authorize(Policy = "RequiredAdminRole")]
        [HttpGet("usersWithRoles")]
        public async Task<IActionResult> GetUsersWithRoles()
        {
            var usersList = await _context.Users.OrderBy(x => x.UserName)
                .Select(user => new
                {   // select specific object to return
                    Id = user.Id,
                    UserName = user.UserName,
                    Roles = (from userRole in user.UserRoles    // (Linq) to retrun all roles belong to this user
                             join role in _context.Roles
                             on userRole.RoleId
                             equals role.Id
                             select role.Name).ToList()
                }).ToListAsync();

            return Ok(usersList);
        }
        
        [Authorize(Policy = "RequiredAdminRole")]
        [HttpPost("editRoles/{userName}")]
        public async Task<IActionResult> EditRoles(string userName, RoleEditDto roleEditDto)
        {
            var user = await _userManager.FindByNameAsync(userName);

            var userRoles = await _userManager.GetRolesAsync(user);

            var selectedRoles = roleEditDto.RoleNames;

            // selected = selectedRoles != null ? selectedRoles : new string[] {};
            selectedRoles = selectedRoles ?? new string[] {};   // if selectedRole == null but new sting[] {};
            
            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles)); // add selectedRoles except it's current roles ==> mean have the both(all) roles

            if (!result.Succeeded)
                return BadRequest("Failed to add to roles");
            
            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));   // remove currect userRoles

            if (!result.Succeeded)
                return BadRequest("Failed to remove to roles");
            
            return Ok(await _userManager.GetRolesAsync(user));
        }


        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photosForModeration")]
        public IActionResult GetPhotoForModeration()
        {
            return Ok("Admins or moderators can see this");
        }
    }
}