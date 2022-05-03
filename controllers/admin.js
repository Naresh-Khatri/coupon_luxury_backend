import axios from "axios";
export async function refreshToken(req, res) {
  const GOOGLE_REFRESH_TOKEN_URL =
    "https://securetoken.googleapis.com/v1/token?key=" +
    process.env.FIREBASE_API_KEY;
  console.log(
    "__________________________refreshing token_____________________"
  );
  console.log(req.body);
  try {
    const result = await axios.post(GOOGLE_REFRESH_TOKEN_URL, {
      grant_type: "refresh_token",
      refresh_token: req.body.refreshToken,
    });
    console.log("accessToken refreshed", result.data.id_token);
    res.status(200).json({ accessToken: result.data.id_token });
    return;
  } catch (err) {
    console.log("err:", err.response.data.error);
    res.status(400).json(err.response.data.error);
    return;
  }
}
