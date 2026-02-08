"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/[...nextauth]/route";
exports.ids = ["app/api/auth/[...nextauth]/route"];
exports.modules = {

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cedgar%5COneDrive%5CDesktop%5CAI%20APPS%5CMLS%5Cweb%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cedgar%5COneDrive%5CDesktop%5CAI%20APPS%5CMLS%5Cweb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cedgar%5COneDrive%5CDesktop%5CAI%20APPS%5CMLS%5Cweb%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cedgar%5COneDrive%5CDesktop%5CAI%20APPS%5CMLS%5Cweb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   headerHooks: () => (/* binding */ headerHooks),\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),\n/* harmony export */   staticGenerationBailout: () => (/* binding */ staticGenerationBailout)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_edgar_OneDrive_Desktop_AI_APPS_MLS_web_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/[...nextauth]/route.ts */ \"(rsc)/./app/api/auth/[...nextauth]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/[...nextauth]/route\",\n        pathname: \"/api/auth/[...nextauth]\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/[...nextauth]/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\edgar\\\\OneDrive\\\\Desktop\\\\AI APPS\\\\MLS\\\\web\\\\app\\\\api\\\\auth\\\\[...nextauth]\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_edgar_OneDrive_Desktop_AI_APPS_MLS_web_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks, headerHooks, staticGenerationBailout } = routeModule;\nconst originalPathname = \"/api/auth/[...nextauth]/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGJTVCLi4ubmV4dGF1dGglNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNlZGdhciU1Q09uZURyaXZlJTVDRGVza3RvcCU1Q0FJJTIwQVBQUyU1Q01MUyU1Q3dlYiU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDZWRnYXIlNUNPbmVEcml2ZSU1Q0Rlc2t0b3AlNUNBSSUyMEFQUFMlNUNNTFMlNUN3ZWImaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDK0M7QUFDNUg7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSx1R0FBdUc7QUFDL0c7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUM2Sjs7QUFFN0oiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tbHMtZ292ZXJuYW5jZS13ZWIvP2YwNjMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcZWRnYXJcXFxcT25lRHJpdmVcXFxcRGVza3RvcFxcXFxBSSBBUFBTXFxcXE1MU1xcXFx3ZWJcXFxcYXBwXFxcXGFwaVxcXFxhdXRoXFxcXFsuLi5uZXh0YXV0aF1cXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2F1dGgvWy4uLm5leHRhdXRoXVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcZWRnYXJcXFxcT25lRHJpdmVcXFxcRGVza3RvcFxcXFxBSSBBUFBTXFxcXE1MU1xcXFx3ZWJcXFxcYXBwXFxcXGFwaVxcXFxhdXRoXFxcXFsuLi5uZXh0YXV0aF1cXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgaGVhZGVySG9va3MsIHN0YXRpY0dlbmVyYXRpb25CYWlsb3V0IH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIGhlYWRlckhvb2tzLCBzdGF0aWNHZW5lcmF0aW9uQmFpbG91dCwgb3JpZ2luYWxQYXRobmFtZSwgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cedgar%5COneDrive%5CDesktop%5CAI%20APPS%5CMLS%5Cweb%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cedgar%5COneDrive%5CDesktop%5CAI%20APPS%5CMLS%5Cweb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/auth/[...nextauth]/route.ts":
/*!*********************************************!*\
  !*** ./app/api/auth/[...nextauth]/route.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n\n\nconst handler = next_auth__WEBPACK_IMPORTED_MODULE_0___default()({\n    providers: [\n        {\n            id: \"bluejax\",\n            name: \"Blue Jax\",\n            type: \"oauth\",\n            authorization: {\n                url: \"https://marketplace.gohighlevel.com/oauth/chooselocation\",\n                params: {\n                    scope: \"contacts.readonly locations.readonly\"\n                }\n            },\n            token: \"https://services.leadconnectorhq.com/oauth/token\",\n            userinfo: \"https://services.leadconnectorhq.com/oauth/userinfo\",\n            clientId: process.env.BLUE_JAX_CLIENT_ID || \"dummy\",\n            clientSecret: process.env.BLUE_JAX_CLIENT_SECRET || \"dummy\",\n            profile (profile) {\n                return {\n                    id: profile.id || profile.sub,\n                    name: profile.name || profile.firstName + \" \" + profile.lastName,\n                    email: profile.email,\n                    image: profile.picture,\n                    role: profile.role || \"user\"\n                };\n            }\n        },\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n            name: \"Mock Credentials (Dev Only)\",\n            credentials: {\n                username: {\n                    label: \"Username\",\n                    type: \"text\",\n                    placeholder: \"admin\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (false) {}\n                if (credentials?.username === \"admin\" && credentials?.password === \"admin\") {\n                    return {\n                        id: \"1\",\n                        name: \"Broker Admin\",\n                        email: \"admin@remax-polanco.mx\",\n                        image: \"https://ui-avatars.com/api/?name=Broker+Admin&background=0D8ABC&color=fff\",\n                        role: \"Agencia Admin\"\n                    };\n                }\n                return null;\n            }\n        })\n    ],\n    callbacks: {\n        async session ({ session, token }) {\n            if (session.user) {\n                session.user.id = token.sub;\n                session.user.role = token.role;\n                session.accessToken = token.accessToken; // Persist token for API calls\n            }\n            return session;\n        },\n        async jwt ({ token, user }) {\n            if (user) {\n                token.role = user.role;\n                // Use a valid-looking mock JWT structure for development decoding\n                token.accessToken = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJPeFN3YXZ6akc5NTBVYjRtM3RJWSIsImxvY2F0aW9uX2lkIjoiR0MzUTVlcXdES3cyTWhaUTBLU2oiLCJlbWFpbCI6ImFkbWluQHJlbWF4LXBvbGFuY28ubXgiLCJyb2xlcyI6WyJhZG1pbiJdfQ.mock_signature\";\n            }\n            // Self-healing for existing dev sessions without a token\n            if (!token.accessToken && \"development\" === \"development\") {\n                token.accessToken = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJPeFN3YXZ6akc5NTBVYjRtM3RJWSIsImxvY2F0aW9uX2lkIjoiR0MzUTVlcXdES3cyTWhaUTBLU2oiLCJlbWFpbCI6ImFkbWluQHJlbWF4LXBvbGFuY28ubXgiLCJyb2xlcyI6WyJhZG1pbiJdfQ.mock_signature\";\n            }\n            return token;\n        }\n    },\n    theme: {\n        colorScheme: \"dark\",\n        brandColor: \"#3b82f6\",\n        logo: \"https://ui-avatars.com/api/?name=BJ&background=3b82f6&color=fff\"\n    },\n    pages: {\n        signIn: \"/auth/signin\"\n    }\n});\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUNpQztBQUNpQztBQUVsRSxNQUFNRSxVQUFVRixnREFBUUEsQ0FBQztJQUNyQkcsV0FBVztRQUNQO1lBQ0lDLElBQUk7WUFDSkMsTUFBTTtZQUNOQyxNQUFNO1lBQ05DLGVBQWU7Z0JBQ1hDLEtBQUs7Z0JBQ0xDLFFBQVE7b0JBQUVDLE9BQU87Z0JBQXVDO1lBQzVEO1lBQ0FDLE9BQU87WUFDUEMsVUFBVTtZQUNWQyxVQUFVQyxRQUFRQyxHQUFHLENBQUNDLGtCQUFrQixJQUFJO1lBQzVDQyxjQUFjSCxRQUFRQyxHQUFHLENBQUNHLHNCQUFzQixJQUFJO1lBQ3BEQyxTQUFRQSxPQUFPO2dCQUNYLE9BQU87b0JBQ0hmLElBQUllLFFBQVFmLEVBQUUsSUFBSWUsUUFBUUMsR0FBRztvQkFDN0JmLE1BQU1jLFFBQVFkLElBQUksSUFBSWMsUUFBUUUsU0FBUyxHQUFHLE1BQU1GLFFBQVFHLFFBQVE7b0JBQ2hFQyxPQUFPSixRQUFRSSxLQUFLO29CQUNwQkMsT0FBT0wsUUFBUU0sT0FBTztvQkFDdEJDLE1BQU1QLFFBQVFPLElBQUksSUFBSTtnQkFDMUI7WUFDSjtRQUNKO1FBQ0F6QiwyRUFBbUJBLENBQUM7WUFDaEJJLE1BQU07WUFDTnNCLGFBQWE7Z0JBQ1RDLFVBQVU7b0JBQUVDLE9BQU87b0JBQVl2QixNQUFNO29CQUFRd0IsYUFBYTtnQkFBUTtnQkFDbEVDLFVBQVU7b0JBQUVGLE9BQU87b0JBQVl2QixNQUFNO2dCQUFXO1lBQ3BEO1lBQ0EsTUFBTTBCLFdBQVVMLFdBQVc7Z0JBQ3ZCLElBQUliLEtBQXlCLEVBQWMsRUFBWTtnQkFFdkQsSUFBSWEsYUFBYUMsYUFBYSxXQUFXRCxhQUFhSSxhQUFhLFNBQVM7b0JBQ3hFLE9BQU87d0JBQ0gzQixJQUFJO3dCQUNKQyxNQUFNO3dCQUNOa0IsT0FBTzt3QkFDUEMsT0FBTzt3QkFDUEUsTUFBTTtvQkFDVjtnQkFDSjtnQkFDQSxPQUFPO1lBQ1g7UUFDSjtLQUNIO0lBQ0RPLFdBQVc7UUFDUCxNQUFNQyxTQUFRLEVBQUVBLE9BQU8sRUFBRXZCLEtBQUssRUFBTztZQUNqQyxJQUFJdUIsUUFBUUMsSUFBSSxFQUFFO2dCQUNkRCxRQUFRQyxJQUFJLENBQUMvQixFQUFFLEdBQUdPLE1BQU1TLEdBQUc7Z0JBQzNCYyxRQUFRQyxJQUFJLENBQUNULElBQUksR0FBR2YsTUFBTWUsSUFBSTtnQkFDOUJRLFFBQVFFLFdBQVcsR0FBR3pCLE1BQU15QixXQUFXLEVBQUUsOEJBQThCO1lBQzNFO1lBQ0EsT0FBT0Y7UUFDWDtRQUNBLE1BQU1HLEtBQUksRUFBRTFCLEtBQUssRUFBRXdCLElBQUksRUFBTztZQUMxQixJQUFJQSxNQUFNO2dCQUNOeEIsTUFBTWUsSUFBSSxHQUFHUyxLQUFLVCxJQUFJO2dCQUN0QixrRUFBa0U7Z0JBQ2xFZixNQUFNeUIsV0FBVyxHQUFHO1lBQ3hCO1lBQ0EseURBQXlEO1lBQ3pELElBQUksQ0FBQ3pCLE1BQU15QixXQUFXLElBQUl0QixrQkFBeUIsZUFBZTtnQkFDOURILE1BQU15QixXQUFXLEdBQUc7WUFDeEI7WUFDQSxPQUFPekI7UUFDWDtJQUNKO0lBQ0EyQixPQUFPO1FBQ0hDLGFBQWE7UUFDYkMsWUFBWTtRQUNaQyxNQUFNO0lBQ1Y7SUFDQUMsT0FBTztRQUNIQyxRQUFRO0lBQ1o7QUFDSjtBQUUyQyIsInNvdXJjZXMiOlsid2VicGFjazovL21scy1nb3Zlcm5hbmNlLXdlYi8uL2FwcC9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlLnRzP2M4YTQiXSwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCBOZXh0QXV0aCBmcm9tIFwibmV4dC1hdXRoXCI7XHJcbmltcG9ydCBDcmVkZW50aWFsc1Byb3ZpZGVyIGZyb20gXCJuZXh0LWF1dGgvcHJvdmlkZXJzL2NyZWRlbnRpYWxzXCI7XHJcblxyXG5jb25zdCBoYW5kbGVyID0gTmV4dEF1dGgoe1xyXG4gICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZDogXCJibHVlamF4XCIsXHJcbiAgICAgICAgICAgIG5hbWU6IFwiQmx1ZSBKYXhcIixcclxuICAgICAgICAgICAgdHlwZTogXCJvYXV0aFwiLFxyXG4gICAgICAgICAgICBhdXRob3JpemF0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiaHR0cHM6Ly9tYXJrZXRwbGFjZS5nb2hpZ2hsZXZlbC5jb20vb2F1dGgvY2hvb3NlbG9jYXRpb25cIixcclxuICAgICAgICAgICAgICAgIHBhcmFtczogeyBzY29wZTogXCJjb250YWN0cy5yZWFkb25seSBsb2NhdGlvbnMucmVhZG9ubHlcIiB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRva2VuOiBcImh0dHBzOi8vc2VydmljZXMubGVhZGNvbm5lY3RvcmhxLmNvbS9vYXV0aC90b2tlblwiLFxyXG4gICAgICAgICAgICB1c2VyaW5mbzogXCJodHRwczovL3NlcnZpY2VzLmxlYWRjb25uZWN0b3JocS5jb20vb2F1dGgvdXNlcmluZm9cIiwgLy8gSHlwb3RoZXRpY2FsIHN0YW5kYXJkXHJcbiAgICAgICAgICAgIGNsaWVudElkOiBwcm9jZXNzLmVudi5CTFVFX0pBWF9DTElFTlRfSUQgfHwgXCJkdW1teVwiLFxyXG4gICAgICAgICAgICBjbGllbnRTZWNyZXQ6IHByb2Nlc3MuZW52LkJMVUVfSkFYX0NMSUVOVF9TRUNSRVQgfHwgXCJkdW1teVwiLFxyXG4gICAgICAgICAgICBwcm9maWxlKHByb2ZpbGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHByb2ZpbGUuaWQgfHwgcHJvZmlsZS5zdWIsXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogcHJvZmlsZS5uYW1lIHx8IHByb2ZpbGUuZmlyc3ROYW1lICsgJyAnICsgcHJvZmlsZS5sYXN0TmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBlbWFpbDogcHJvZmlsZS5lbWFpbCxcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogcHJvZmlsZS5waWN0dXJlLFxyXG4gICAgICAgICAgICAgICAgICAgIHJvbGU6IHByb2ZpbGUucm9sZSB8fCAndXNlcidcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBDcmVkZW50aWFsc1Byb3ZpZGVyKHtcclxuICAgICAgICAgICAgbmFtZTogXCJNb2NrIENyZWRlbnRpYWxzIChEZXYgT25seSlcIixcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6IHtcclxuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiB7IGxhYmVsOiBcIlVzZXJuYW1lXCIsIHR5cGU6IFwidGV4dFwiLCBwbGFjZWhvbGRlcjogXCJhZG1pblwiIH0sXHJcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogeyBsYWJlbDogXCJQYXNzd29yZFwiLCB0eXBlOiBcInBhc3N3b3JkXCIgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhc3luYyBhdXRob3JpemUoY3JlZGVudGlhbHMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY3JlZGVudGlhbHM/LnVzZXJuYW1lID09PSBcImFkbWluXCIgJiYgY3JlZGVudGlhbHM/LnBhc3N3b3JkID09PSBcImFkbWluXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogXCIxXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFwiQnJva2VyIEFkbWluXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiBcImFkbWluQHJlbWF4LXBvbGFuY28ubXhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IFwiaHR0cHM6Ly91aS1hdmF0YXJzLmNvbS9hcGkvP25hbWU9QnJva2VyK0FkbWluJmJhY2tncm91bmQ9MEQ4QUJDJmNvbG9yPWZmZlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByb2xlOiBcIkFnZW5jaWEgQWRtaW5cIlxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICBdLFxyXG4gICAgY2FsbGJhY2tzOiB7XHJcbiAgICAgICAgYXN5bmMgc2Vzc2lvbih7IHNlc3Npb24sIHRva2VuIH06IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoc2Vzc2lvbi51c2VyKSB7XHJcbiAgICAgICAgICAgICAgICBzZXNzaW9uLnVzZXIuaWQgPSB0b2tlbi5zdWI7XHJcbiAgICAgICAgICAgICAgICBzZXNzaW9uLnVzZXIucm9sZSA9IHRva2VuLnJvbGU7XHJcbiAgICAgICAgICAgICAgICBzZXNzaW9uLmFjY2Vzc1Rva2VuID0gdG9rZW4uYWNjZXNzVG9rZW47IC8vIFBlcnNpc3QgdG9rZW4gZm9yIEFQSSBjYWxsc1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzZXNzaW9uO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYXN5bmMgand0KHsgdG9rZW4sIHVzZXIgfTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi5yb2xlID0gdXNlci5yb2xlO1xyXG4gICAgICAgICAgICAgICAgLy8gVXNlIGEgdmFsaWQtbG9va2luZyBtb2NrIEpXVCBzdHJ1Y3R1cmUgZm9yIGRldmVsb3BtZW50IGRlY29kaW5nXHJcbiAgICAgICAgICAgICAgICB0b2tlbi5hY2Nlc3NUb2tlbiA9ICdleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKemRXSWlPaUpQZUZOM1lYWjZha2M1TlRCVllqUnRNM1JKV1NJc0lteHZZMkYwYVc5dVgybGtJam9pUjBNelVUVmxjWGRFUzNjeVRXaGFVVEJMVTJvaUxDSmxiV0ZwYkNJNkltRmtiV2x1UUhKbGJXRjRMWEJ2YkdGdVkyOHViWGdpTENKeWIyeGxjeUk2V3lKaFpHMXBiaUpkZlEubW9ja19zaWduYXR1cmUnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIFNlbGYtaGVhbGluZyBmb3IgZXhpc3RpbmcgZGV2IHNlc3Npb25zIHdpdGhvdXQgYSB0b2tlblxyXG4gICAgICAgICAgICBpZiAoIXRva2VuLmFjY2Vzc1Rva2VuICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XHJcbiAgICAgICAgICAgICAgICB0b2tlbi5hY2Nlc3NUb2tlbiA9ICdleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKemRXSWlPaUpQZUZOM1lYWjZha2M1TlRCVllqUnRNM1JKV1NJc0lteHZZMkYwYVc5dVgybGtJam9pUjBNelVUVmxjWGRFUzNjeVRXaGFVVEJMVTJvaUxDSmxiV0ZwYkNJNkltRmtiV2x1UUhKbGJXRjRMWEJ2YkdGdVkyOHViWGdpTENKeWIyeGxjeUk2V3lKaFpHMXBiaUpkZlEubW9ja19zaWduYXR1cmUnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0b2tlbjtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgdGhlbWU6IHtcclxuICAgICAgICBjb2xvclNjaGVtZTogXCJkYXJrXCIsXHJcbiAgICAgICAgYnJhbmRDb2xvcjogXCIjM2I4MmY2XCIsXHJcbiAgICAgICAgbG9nbzogXCJodHRwczovL3VpLWF2YXRhcnMuY29tL2FwaS8/bmFtZT1CSiZiYWNrZ3JvdW5kPTNiODJmNiZjb2xvcj1mZmZcIlxyXG4gICAgfSxcclxuICAgIHBhZ2VzOiB7XHJcbiAgICAgICAgc2lnbkluOiAnL2F1dGgvc2lnbmluJyxcclxuICAgIH1cclxufSk7XHJcblxyXG5leHBvcnQgeyBoYW5kbGVyIGFzIEdFVCwgaGFuZGxlciBhcyBQT1NUIH07XHJcbiJdLCJuYW1lcyI6WyJOZXh0QXV0aCIsIkNyZWRlbnRpYWxzUHJvdmlkZXIiLCJoYW5kbGVyIiwicHJvdmlkZXJzIiwiaWQiLCJuYW1lIiwidHlwZSIsImF1dGhvcml6YXRpb24iLCJ1cmwiLCJwYXJhbXMiLCJzY29wZSIsInRva2VuIiwidXNlcmluZm8iLCJjbGllbnRJZCIsInByb2Nlc3MiLCJlbnYiLCJCTFVFX0pBWF9DTElFTlRfSUQiLCJjbGllbnRTZWNyZXQiLCJCTFVFX0pBWF9DTElFTlRfU0VDUkVUIiwicHJvZmlsZSIsInN1YiIsImZpcnN0TmFtZSIsImxhc3ROYW1lIiwiZW1haWwiLCJpbWFnZSIsInBpY3R1cmUiLCJyb2xlIiwiY3JlZGVudGlhbHMiLCJ1c2VybmFtZSIsImxhYmVsIiwicGxhY2Vob2xkZXIiLCJwYXNzd29yZCIsImF1dGhvcml6ZSIsImNhbGxiYWNrcyIsInNlc3Npb24iLCJ1c2VyIiwiYWNjZXNzVG9rZW4iLCJqd3QiLCJ0aGVtZSIsImNvbG9yU2NoZW1lIiwiYnJhbmRDb2xvciIsImxvZ28iLCJwYWdlcyIsInNpZ25JbiIsIkdFVCIsIlBPU1QiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/[...nextauth]/route.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/uuid","vendor-chunks/oauth","vendor-chunks/@panva","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/preact","vendor-chunks/oidc-token-hash","vendor-chunks/lru-cache","vendor-chunks/cookie"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cedgar%5COneDrive%5CDesktop%5CAI%20APPS%5CMLS%5Cweb%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cedgar%5COneDrive%5CDesktop%5CAI%20APPS%5CMLS%5Cweb&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();