using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers 
{

    [Route ("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController : ControllerBase 
    {
        // private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        public AuthController (IConfiguration config, IMapper mapper,
            UserManager<User> userManager, SignInManager<User> signInManager) 
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _mapper = mapper;
            _config = config;
            // _repo = repo;
        }

        [HttpPost ("register")]
        public async Task<IActionResult> Register (UserForRegisterDto userForRegisterDto) 
        {
            // if we use [ApiController] attribute we don't need to validate request and [fromBody] attribute
            // // validate request
            // if (!ModelState.IsValid)
            //     return BadRequest(ModelState);

            // userForRegisterDto.Username = userForRegisterDto.Username.ToLower();

            // if (await _repo.UserExists(userForRegisterDto.Username))
            //     return BadRequest("Username already exists");

            var userToCreate = _mapper.Map<User> (userForRegisterDto);

            var result = await _userManager.CreateAsync (userToCreate, userForRegisterDto.Password);

            // var createdUser = await _repo.Register(userToCreate, userForRegisterDto.Password);

            var userToReturn = _mapper.Map<UserForDetailedDto> (userToCreate);

            if (result.Succeeded) {
                return CreatedAtRoute ("GetUser", new { controller = "users", id = userToCreate.Id }, userToReturn);
            }

            return BadRequest (result.Errors);
        }

        [HttpPost ("login")]
        public async Task<IActionResult> Login (UserForLoginDto userForLoginDto) 
        {
            var user = await _userManager.FindByNameAsync (userForLoginDto.Username);

            if (user == null)
                return NotFound ("Username not exist");

            var result = await _signInManager.CheckPasswordSignInAsync (user, userForLoginDto.Password, false);

            if (result.Succeeded) 
            {
                user = await _userManager.Users.Include (u => u.Photos).SingleAsync (u => u.UserName == user.UserName);
                var appUser = _mapper.Map<UserForListDto> (user);

                return Ok (new {
                    token = GenerateJwtToken (user).Result,
                        user = appUser
                });
            }

            return Unauthorized ();

        }

        private async Task<string> GenerateJwtToken (User user) 
        {
            // Generate JWT authentication token to send to user to make server validate this token with each request without going to database 
            var claims = new List<Claim> 
            {
                new Claim (ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim (ClaimTypes.Name, user.UserName)
            };

            var roles = await _userManager.GetRolesAsync (user);

            foreach (var role in roles) 
            {
                claims.Add (new Claim (ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey (Encoding.UTF8.GetBytes (_config.GetSection ("AppSettings:Token").Value));

            var creds = new SigningCredentials (key, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor 
            {
                Subject = new ClaimsIdentity (claims),
                Expires = DateTime.Now.AddDays (1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler ();

            var token = tokenHandler.CreateToken (tokenDescriptor);

            return tokenHandler.WriteToken (token);
        }

    }
}