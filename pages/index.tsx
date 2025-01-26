import React from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { Row, Col, Image } from "antd"

import AgileLayout from "./_layout"
import { banners } from "../data/home/banner"
import { Footer } from "../components/footer"


export async function getStaticProps() {
  return {
    props: {
      banners: banners
    },
  }
}

const Content = React.memo(function _component() {
  return (
    <div>
      TODO
    </div>
  )
})

const ImageLeft = ({ banner }: any) => {
  const router = useRouter()

  return (
    <Row style={{ cursor: "pointer" }} onClick={() => router.push(`/banners/${banner.id}`)}>
      <Col xs={24} sm={24} md={16} lg={16} xl={0} xxl={0}>
        <Image src={banner.thumbnail} preview={false} alt={banner.title} style={{ display: "inline" }} />
      </Col>
      <Col xs={24} sm={24} md={8} lg={8} xl={0} xxl={0}
        style={{
          background: banner.bg_color,
          color: banner.font_color,
          padding: "1rem",
        }}
      >
        <h2 style={{
          color: banner.font_color,
          fontWeight: 900,
          fontSize: "2.5rem",
          minHeight: 50,
          whiteSpace: "pre-line",
          fontFamily: "Montserrat",
        }}
        >
          {banner.title}
        </h2>
        <h4 style={{
          color: banner.font_color,
          fontWeight: 400,
          fontFamily: "PingFangTC-Regular",
        }}
        >
          {banner.sub_title}
        </h4>
      </Col>

      <Col xs={0} sm={0} md={0} lg={0} xl={16} xxl={16}>
        <Image src={banner.thumbnail} preview={false} alt={banner.title} style={{ display: "inline" }} />
      </Col>
      <Col xs={0} sm={0} md={0} lg={0} xl={8} xxl={8}
        style={{
          background: banner.bg_color, color: banner.font_color, padding: "3rem  2rem"
        }}
      >
        <h2
          style={{
            color: banner.font_color,
            fontWeight: 900,
            fontSize: "3.5rem",
            marginTop: "3rem",
            whiteSpace: "pre-line",
            fontFamily: "Montserrat",
          }}
        >
          {banner.title}
        </h2>
        <h4
          style={{
            color: banner.font_color,
            fontWeight: 400,
            margin: "2rem 0",
            fontSize: "1.5rem",
            whiteSpace: "pre-line",
            fontFamily: "PingFangTC-Regular",
          }}
        >
          {banner.sub_title}
        </h4>
      </Col>
      <style jsx>{`h2 {margin: 0; white-space: pre-line;}`}</style>
    </Row>
  )
}

const ImageRight = ({ banner }: any) => {
  const router = useRouter()

  return (
    <Row style={{ cursor: "pointer" }} onClick={() => router.push(`/banners/${banner.id}`)}>
      <Col xs={0} sm={0} md={8} lg={8} xl={0} xxl={0}
        style={{
          background: banner.bg_color,
          padding: "1rem",
        }}
      >
        <h2
          style={{
            color: banner.font_color,
            fontWeight: 900,
            fontSize: "2.5rem",
            minHeight: 50,
            whiteSpace: "pre-line",
            fontFamily: "Montserrat",
          }}
        >
          {banner.title}
        </h2>
        <h4
          style={{
            color: banner.font_color,
            fontWeight: 400,
            whiteSpace: "pre-line",
            fontFamily: "PingFangTC-Regular",
          }}
        >
          {banner.sub_title}
        </h4>
      </Col>
      <Col xs={24} sm={24} md={16} lg={16} xl={0} xxl={0}>
        <Image
          src={banner.thumbnail}
          preview={false}
          alt={banner.title}
          style={{ display: "inline", height: "100%" }}
        />
      </Col>
      <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0}
        style={{
          background: banner.bg_color,
          padding: "1rem",
        }}
      >
        <h2
          style={{
            color: banner.font_color,
            fontWeight: 900,
            fontSize: "2.5rem",
            minHeight: 50,
            whiteSpace: "pre-line",
            fontFamily: "Montserrat",
          }}
        >
          {banner.title}
        </h2>
        <h4
          style={{
            color: banner.font_color,
            fontWeight: 400,
            whiteSpace: "pre-line",
            fontFamily: "PingFangTC-Regular",
          }}
        >
          {banner.sub_title}
        </h4>
      </Col>
      <Col xs={0} sm={0} md={0} lg={0} xl={8} xxl={8}
        style={{
          background: banner.bg_color,
          padding: "1.5rem 2rem ",
        }}
      >
        <h2
          style={{
            color: banner.font_color,
            fontWeight: 900,
            fontSize: "3.5rem",
            marginTop: "3rem",
            whiteSpace: "pre-line",
            fontFamily: "Montserrat",
          }}
        >
          {banner.title}
        </h2>
        <h4
          style={{
            color: banner.font_color,
            fontWeight: 400,
            margin: "2rem 0",
            fontSize: "1.5rem",
            whiteSpace: "pre-line",
            fontFamily: "PingFangTC-Regular",
          }}
        >
          {banner.sub_title}
        </h4>
      </Col>
      <Col xs={0} sm={0} md={0} lg={0} xl={16} xxl={16}>
        <Image
          src={banner.thumbnail}
          preview={false}
          alt={banner.title}
          style={{ display: "inline", height: "100%" }}
        />
      </Col>
    </Row>
  )
}

const Banners = React.memo(function _component({ banners }: any) {
  return <>
    {
      banners.map((banner: any, index: any) => {
        return index % 2 === 0 ? <ImageLeft key={index} banner={banner} /> : <ImageRight key={index} banner={banner} />
      })
    }
  </>
})


function Home(props: any) {
  const { banners } = props

  return (
    <>
      <Head>
        <title>Home / Agile</title>
        <meta name="description" content="Home" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Banners banners={banners} />
      <Content />
      <Footer />
    </>
  )
}

export default AgileLayout(Home)
