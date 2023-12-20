import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ClockCircleOutlined, LikeOutlined } from "@ant-design/icons";
import axios from 'axios';
import { clsx } from 'clsx';

const DetailVideo = () => {
    const { id } = useParams();

    const [data, setData] = useState<any>();
    const [like, setLike] = useState(false);
    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_DOMAIN}/detail?type=video&id=${id}`)
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [id]);

    const toggleLike = () => {
        setLike(prev => !prev)
    }

    return (data && (
        <div className="container mx-auto max-w-[1200px]">
            <div className="pt-16 pb-10">
                <div className="container mx-auto max-w-[800px] mb-6">
                    <div className="mb-3 font-semibold">
                        <Link to="/exercise">Exercise</Link>
                        <span className="mx-2">/</span>
                        <Link className="cursor-pointer" to={`/exercise?category=${data.category}`}>{data.category}</Link>
                    </div>
                    <div className="text-4xl font-semibold">{data.title}</div>
                    <div className="mt-8 text-[#A8A29E]">
                        <ClockCircleOutlined />
                        <span className="ml-2 tracking-tighter">{data.readtime} minutes to read</span>
                    </div>

                </div>
                <div className="ml-32">
                    <div className='my-5 mx-auto max-w-[560px]'>
                        <iframe width="560" height="315" src={data.link} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: data.content }} />
                </div>
                <div className="font-semibold text-center mt-5">
                    <span>Do you think this video was helpful?</span>
                    <div className="flex gap-3 justify-center mt-3">
                        <div className={clsx(like === true ? "bg-blue-500" : "", "w-[49px] h-[49px] rounded-full text-center border-[2px] border-black leading-[42px]  hover:cursor-pointer")} onClick={toggleLike}>
                            <LikeOutlined />
                        </div>
                        <div className="w-[49px] h-[49px] rounded-full text-center border-[2px] border-black text-2xl leading-[42px]">6</div>
                    </div>
                </div>
            </div>
        </div>
    ))
}

export default DetailVideo
