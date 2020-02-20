using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers {
    [Authorize]
    [Route ("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public UsersController (IDatingRepository repo, IMapper mapper) {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers () {
            var users = await _repo.GetUsers ();
            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
            return Ok (usersToReturn);
        }

        [HttpGet ("{id}")]
        public async Task<IActionResult> GetUser (int id) {
            var user = await _repo.GetUser (id);
            if (user == null) {
                return NotFound ();
            }

            var userToReturn = _mapper.Map<UserForDetailedDto>(user);
            return Ok (userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdate)
        {
            // check if the user is the user that past the token up to our server ==> if the id is the same id(from the token) that loggedIn
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userFromRepo = await _repo.GetUser(id);

            _mapper.Map(userForUpdate, userFromRepo);

            if (await _repo.SaveAll())
                return NoContent();
            
            throw new Exception($"Update User {id} failed on save");
        }

    }
}