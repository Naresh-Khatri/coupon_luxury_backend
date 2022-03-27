import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert({
    project_id: "coupon-luxury",
    private_key_id: "2762e9e8d2ecfd9deb017078b9d7b039ad495a9a",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCc6a02PCFNfWr0\nUo90DiKjE1CQhlPEHohIUiX2rd9qPTakbQgpMV0q4THvutK4t5pUQ4AdRn7upA/a\nsTWMGPkTd9W5AQW60IHYii3/LTvbCtSetI+xH2eog4UsoaMu0ZFONh52LwXvYCUT\nZnUFwIFGOwetRr9rko0x5X8Gsa+9IGDaZytqUcjgzEwNghyZqgXpUo4QzQRgi97S\n/Oi/OFqZQb1zJHkNzVz9FFDr95juMU9sCnRSV9c94Sh6OkWgbLCiLEMeHUl7roAK\naHSVoIpFbSybmnuxdZl7/5jIbmipCDeBkhJT9H0aLqQ1ETc8JLTJJg62SmxCwiYI\nk45Lm6+bAgMBAAECggEAAk1FqdHQZac2v9mYmlaji9bg5XqpYetWWBFBPOqO23hS\nA+MUx13ravfQvrgnFs416MSKU/029KzaQRZwBA63U+GVjgtr/rIuWKapeno6y/TP\nUUcYaiKQZ7ikmUoDVdCwzzMccUlkgeV1xcbiZco0KBT+ANaH2leIOlIoJRX+nC/T\nUIvj0YidSbnx/Aq5qmfw1CfwdXokKuLtyvfKF3vKQWA36mbbFqcBu0zgQ4/4UCMj\nzQJuZu3WolAJI50PKxa058gXqCzqh7ytnMz/mKQc/+SHwFWd0eRhuFxrojKdLeCy\nLtyx8s9oNPq4xPVicvD0BlqJA/HsYL69FZhthw1CMQKBgQDWvsDCNi5fAYHOS2ea\nKjnP6mtXIlAd3FJ+d+BZp8ZkIKzNPfPBTH3ik5+ZeqSXQHP+YvudR4xxYDkqXtuK\nCrK2GYIvMzD1c4H5P3lvg/rsbhZzzXUBw8F1OQ7MeuaxDb5vJLg9Ku5ifA/CDdHo\nUcArPAUwROdLmiqQGrEtFE2UQwKBgQC7DrUsD1R0zi/jG2/0yySUID/vPr5/4qyM\nGzWgYVeeE2BZwVBGPQ0gOLmV70PPAQRt6ddzdvItiM0mulayLCdeC5FAGg/EtO7e\nsmFBBjiXZUimkxgsrcvj8aKRIYc+epG3AzNn56NBw6GxZyqW/YLLqpbkR5kK9xz7\nt+gLnOutyQKBgAyrxr3u6n+KnDkq89sB4NVm1JyYlrecV3XE5wUDRE6GKwwVOrvO\nIqNq6IDq3qlaET4SYxxdq2jJL7ZTUIrtpKvgB3F3iM0C2sl1OFofJIAs4sBEgEHx\nZgnfqwLfwZry36i5NvHNBbHj9h4SKK+Xm0oxyXCWsDsixp4oJQou54D3AoGAFXAn\nFWigXk6vMFEZsK2DgLJ9gVbokFGTQu9vYvUlDInd9gtwvswKcBHwOx3T4KqWLl6p\ngaM1OEDAelrKytrCnEWpHPafrgSqh71b5g7nd3p1LBoZoC0++93aqtVz4ZY8kwP7\n5UGn9UaNhn5zZCCj1+GyL3GBOb9+g97c6k/OtvkCgYB3m9GmxV30R6EJEj7XByXj\nKdg9On413mDubsV2I/BXOuBXigrU0wYy48IqbSyWDGBv+H25Pugg1UcnM+YZYWbN\ns8KaLzVxCbRbhVUb9MODUnA3DggqeRsCsiy2fuNe8xxT1osXpEmtSIzPPl446BVG\neKnK72ydL4SWOV6OT0fBXg==\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-rtnos@coupon-luxury.iam.gserviceaccount.com",
    client_id: "100905278035516680161",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
  }),
});

export default admin;
