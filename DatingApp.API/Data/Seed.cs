using System.Collections.Generic;
using System.Linq;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public class Seed
    {
        public static void SeedUsers(UserManager<User> userManager, RoleManager<Role> roleManager) 
        {
            if(!userManager.Users.Any())
            {
                var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
                var users = JsonConvert.DeserializeObject<List<User>>(userData);    // convert json data to User Class data to loop on it

                // Create some role

                var roles = new List<Role>
                {
                    new Role{Name = "Admin"},
                    new Role{Name = "Moderator"},
                    new Role{Name = "VIP"},
                    new Role{Name = "Member"},
                };

                foreach(var role in roles)
                {
                    roleManager.CreateAsync(role).Wait();
                }

                foreach(var user in users)
                {
                    userManager.CreateAsync(user, "password").Wait();
                    userManager.AddToRoleAsync(user, "Member").Wait();

                    // byte[] passwordHash, passwordSalt;
                    // CreatePasswordHash("password", out passwordHash, out passwordSalt); // password ==> is hard code password i created it when generating json data

                    // user.PasswordHash = passwordHash;
                    // user.PasswordSalt = passwordSalt;
                    // user.UserName = user.UserName.ToLower();

                    // context.Users.Add(user);
                }

                // Create admin user
                var adminUser = new User
                {
                    UserName = "Admin"
                };
                var results = userManager.CreateAsync(adminUser, "password").Result;

                if (results.Succeeded)
                {
                    var admin = userManager.FindByNameAsync("Admin").Result;
                    userManager.AddToRolesAsync(admin, new[] {"Admin", "Moderator", "VIP"});
                }

                // context.SaveChanges();
            }
        }

        private static void CreatePasswordHash(string password, out byte[] passowordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passowordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}