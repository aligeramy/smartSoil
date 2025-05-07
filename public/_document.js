// This file helps with serving the correct fonts on Vercel
import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Preload icon fonts */}
          <link
            href="https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/Ionicons.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/MaterialIcons.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/MaterialCommunityIcons.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/FontAwesome.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/FontAwesome5_Brands.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/FontAwesome5_Regular.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/FontAwesome5_Solid.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/Feather.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/Entypo.css"
            rel="stylesheet"
          />
          <link
            href="https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/AntDesign.css"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument; 