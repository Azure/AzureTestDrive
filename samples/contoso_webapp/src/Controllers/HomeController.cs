//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
//-----------------------------------------------------------------------------

using System;
using System.Configuration;
using System.Web.Mvc;

namespace ContosoWebApp.Controllers
{
    public class HomeController : Controller
    {
        public class HomeViewModel
        {
            public bool Success { get; set; }

            public string Message { get; set; }
        }

        public ActionResult Index()
        {
            return View("~/Views/Index.cshtml", new HomeViewModel());
        }

        [HttpPost]
        public ActionResult Index(string userName, string password)
        {
            var viewModel = new HomeViewModel();
            var expectedUserName = ConfigurationManager.AppSettings["UserName"];
            var expectedPassword = ConfigurationManager.AppSettings["Password"];

            if (string.Equals(userName, expectedUserName, StringComparison.OrdinalIgnoreCase) && string.Equals(password, expectedPassword, StringComparison.Ordinal))
            {
                viewModel.Success = true;
            }
            else
            {
                viewModel.Success = false;
                viewModel.Message = "Invalid user name or password.";
            }

            return View("~/Views/Index.cshtml", viewModel);
        }
    }
}
