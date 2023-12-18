import Search, { SearchProps } from "antd/es/input/Search";
import "./Exercise.scss";
import Slider from "react-slick";
import InstructionalBlog from "./components/InstructionalBlog";
import InstructionalVideo from "./components/InstructionalVideo";
import { useState, useEffect } from "react";
import axios from "axios";

const Exercise = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [categoriesExercise, setCategoriesExercise] = useState<any>([]);
  const [listPost, setListPost] = useState<any>([]);
  const [listVideo, setListVideo] = useState<any>([]);

  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    setSearchTerm(value);
    setCurrentCategory("");
    setLoading(true);
    setTimeout(() => {
      axios
        .get(
          `${import.meta.env.VITE_API_DOMAIN}/search_by_title?title=${value}`
        )
        .then((res) => {
          setLoading(false);
          setListPost(res.data["posts"]);
          setListVideo(res.data["videos"]);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 500);
  };

  const onClickCategory = (name: string) => {
    setSearchTerm("");
    setCurrentCategory(name);
    axios
      .get(`${import.meta.env.VITE_API_DOMAIN}/search_by_category?name=${name}`)
      .then((res) => {
        setListPost(res.data["posts"]);
        setListVideo(res.data["videos"]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 2,
    appendDots: () => (
      <div
        style={{
          display: "none",
        }}
      ></div>
    ),
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_DOMAIN}/list_category`)
      .then((res) => {
        setCategoriesExercise(res.data["categories"]);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${import.meta.env.VITE_API_DOMAIN}/list_post_video`)
      .then((res) => {
        setListPost(res.data["posts"]);
        setListVideo(res.data["videos"]);
      });
  }, []);

  return (
    <div className="bg-[#F5F5F4] excersice-component">
      <div className="container mx-auto max-w-[1200px] pt-10 pb-20">
        <div className="relative">
          <h1 className="text-4xl font-bold">Exercise</h1>
          <Search
            loading={loading}
            placeholder="Enter name"
            onSearch={onSearch}
            style={{ width: 397, height: 52 }}
            className="absolute top-[6px] left-1/2 -translate-x-1/2 "
          />
        </div>
        <div className="pl-5 pt-8 pb-5">
          <Slider {...settings}>
            {categoriesExercise.map((category: any, index: any) => (
              <div
                className={
                  currentCategory === category.name
                    ? "bg-[#EF4444] rounded-lg cursor-pointer text-white"
                    : "bg-[#E7E5E4] rounded-lg cursor-pointer hover:scale-[1.05]"
                }
                key={index}
                onClick={() => {
                  onClickCategory(category.name);
                }}
              >
                <h3 className="text-center py-4 font-semibold">
                  {category.name}
                </h3>
              </div>
            ))}
          </Slider>
        </div>
        <div className="ml-8 grid grid-cols-2 gap-5">
          <InstructionalBlog items={listPost} />
          <InstructionalVideo items={listVideo} />
        </div>
      </div>
    </div>
  );
};

export default Exercise;
