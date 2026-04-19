"use client";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Button } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Divider from "@mui/material/Divider";
import Link from "next/link";
import { convertTextToSlug } from "@/utils/api";
import Image from "next/image";

interface IProps {
	data: ITrackTop[];
	title: string;
}

const MainSlide = (props: IProps) => {
	const { data, title } = props;
	const NextArrow = (props: any) => {
		return (
			<Button
				variant="outlined"
				onClick={props.onClick}
				sx={{
					position: "absolute",
					right: 0,
					top: "45%",
					zIndex: 2,
					minWidth: 30,
					width: 35,
					background: "#e6e6e685",
				}}
			>
				<ChevronRightIcon />
			</Button>
		);
	};

	const PrevArrow = (props: any) => {
		return (
			<Button
				variant="outlined"
				onClick={props.onClick}
				sx={{
					position: "absolute",
					top: "45%",
					zIndex: 2,
					minWidth: 30,
					width: 35,
					background: "#e6e6e685",
				}}
			>
				<ChevronLeftIcon />
			</Button>
		);
	};

	const settings: Settings = {
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: 5,
		slidesToScroll: 4,
		nextArrow: <NextArrow />,
		prevArrow: <PrevArrow />,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
					infinite: true,
					dots: true,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					initialSlide: 2,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};

	return (
		<>
			<Box
				sx={{
					margin: "0 50px",
					".track": {
						padding: "0 10px",
					},
					img: {
						width: "150px",
						height: "150px",
					},
				}}
			>
				<h2> {title} </h2>
				<Slider {...settings}>
					{data.map((track) => (
						<div key={track._id} className="track">
							{/* <img
								src={`${process.env.NEXT_PUBLIC_BACKEND_URL}images/${track.imgUrl}`}
								alt=""
							/> */}
							<div
								style={{ width: "100%", height: "200px", position: "relative" }}
							>
								<Image
									src={`${process.env.NEXT_PUBLIC_BACKEND_URL}images/${track.imgUrl}`}
									alt="tieu de anh"
									width={700}
									height={700}
									style={{
										width: "100%",
										height: "auto",
										objectFit: "cover",
									}}
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 20vw, 33vw"
								/>
							</div>
							<Link
								href={`/track/${convertTextToSlug(track.title)}-${track._id}.html?audio=${track.trackUrl}`}
							>
								<h3>{track.title}</h3>
							</Link>
						</div>
					))}
				</Slider>
			</Box>
			<Divider />
		</>
	);
};

export default MainSlide;
