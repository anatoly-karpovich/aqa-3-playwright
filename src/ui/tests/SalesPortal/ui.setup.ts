import { test } from "fixtures";

const authFile = "src/.auth/user.json";

test("Login to Sales Portal", async ({ page, signInApiService }) => {
  const token = await signInApiService.loginAsLocalUser();
  await page.context().addCookies([
    {
      name: "Authorization",
      value: token,
      domain: process.env.LOCAL ? "127.0.0.1" : "anatoly-karpovich.github.io",
      path: process.env.LOCAL ? "/" : "/aqa-course-project",
      expires: -1,
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);
  await page.context().storageState({ path: authFile });
});

/*
 {
    name: 'Authorization',
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzRmZDYzNzM1YWNlNWIwMzUyN2Y4MSIsInJvbGVzIjpbIlVTRVIiXSwiaWF0IjoxNzQ5OTI0ODE1LCJleHAiOjE3NTAwMTEyMTV9.a_cetE7CjLDvNcNpuExxeiHFYVKeb8xOppfjEIaiYDk',
    domain: '127.0.0.1',
    path: '/',
    expires: -1,
    httpOnly: false,
    secure: false,
    sameSite: 'Lax'
  }
    */
