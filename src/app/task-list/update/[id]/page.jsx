"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";

const Page = ({ params }) => {
    const { data: session } = useSession();
    const user = session?.user;

    const [room, setRoom] = useState({});
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState(null);

    // Unwrap params using React.use()
    useEffect(() => {
        async function unwrapParams() {
            const resolvedParams = await params;
            setId(resolvedParams.id);
        }
        unwrapParams();
    }, [params]);

    const loadRoom = useCallback(async () => {
        if (!id) return;
        try {
            const resortRoomDetail = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/dashboard/myResortRoom/api/resortRoom/${id}`
            );
            const data = await resortRoomDetail.json();
            console.log(data);
            setRoom(data?.data || {});
            setLoading(false);
        } catch (error) {
            console.error("Failed to load Resort Room Data:", error);
            setLoading(false);
        }
    }, [id]);

    const handleUpdateResortRoom = async (e) => {
        e.preventDefault();


        const form = e.target;

        const roomID = form.roomID.value;
        const roomName = form.roomName.value;
        const roomNo = form.roomNo.value;
        const roomType = form.roomType.value;
        const pricePerNight = form.pricePerNight.value;
        const capacity = form.capacity.value;
        const photoURL1 = form.photo1.value;
        const photoURL2 = form.photo2.value;
        const description = form.description.value;
        const email = user ? user?.email : '';


        const updateResortRoom = {
            roomID, roomName, roomNo, roomType, pricePerNight, photoURL1, photoURL2, capacity, email, description
        };

        const resp = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/dashboard/myResortRoom/api/resortRoom/${id}`,
            {
                method: "PATCH",
                body: JSON.stringify(updateResortRoom),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (resp.status === 200) {
            Swal.fire({
                position: "top",
                icon: "success",
                title: "Successfully Updated",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    useEffect(() => {
        loadRoom();
    }, [id, loadRoom]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <div className="font-[sans-serif]">
                <div className="bg-gradient-to-r from-blue-700 to-blue-300 w-full h-36"></div>
                <div className="-mt-20 mb-6 px-4">
                    <div className="mx-auto max-w-6xl shadow-lg p-8 relative bg-white rounded-lg">
                        <h2 className="text-xl text-gray-800 font-bold">Update Resort Room</h2>

                        <form
                            onSubmit={handleUpdateResortRoom}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto"
                        >
                            {/* First column - Room Details */}
                            <div>
                                {/* Room ID and Room Name as side-by-side boxes */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-base text-black font-semibold">
                                                Room ID
                                            </span>
                                        </label>
                                        <input
                                        defaultValue={room?.roomID || ""}
                                            type="text"
                                            name="roomID"
                                            placeholder="Enter Your Room ID"
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-base text-black font-semibold">
                                                Room Name
                                            </span>
                                        </label>
                                        <select
                                            name="roomName"
                                            defaultValue={room?.roomName || ""}
                                            className="select select-bordered text-base w-full"
                                        >
                                            <option>Select Room Name</option>
                                            <option>Deluxe Suite</option>
                                            <option>Family Room</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Room Type and Room No as side-by-side boxes */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-base text-black font-semibold">
                                                Room Type
                                            </span>
                                        </label>
                                        <select
                                        defaultValue={room?.roomType || ""}
                                            name="roomType"
                                            className="select select-bordered text-base w-full"
                                        >
                                            <option>Select Room Type</option>
                                            <option>Single</option>
                                            <option>Double</option>
                                            <option>Suite</option>
                                            <option>Villa</option>
                                        </select>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-base text-black font-semibold">
                                                Room No
                                            </span>
                                        </label>
                                        <input
                                        defaultValue={room?.roomNo || ""}
                                            type="text"
                                            name="roomNo"
                                            placeholder="Enter Room No"
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Price Per Night and Capacity as side-by-side boxes */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-base text-black font-semibold">
                                                Price Per Night
                                            </span>
                                        </label>
                                        <input
                                        defaultValue={room?.pricePerNight || ""}
                                            type="number"
                                            name="pricePerNight"
                                            placeholder="Enter Price Per Night"
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-base text-black font-semibold">
                                                Capacity
                                            </span>
                                        </label>
                                        <input
                                        defaultValue={room?.capacity || ""}
                                            type="number"
                                            name="capacity"
                                            placeholder="Capacity"
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Second column - Photos and User Info */}
                            <div>
                                {/* Photo URL 1 and Photo URL 2 as side-by-side boxes */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-base text-black font-semibold">
                                                Photo URL 1
                                            </span>
                                        </label>
                                        <input
                                         defaultValue={room?.photoURL1 || ""}
                                            type="url"
                                            name="photo1"
                                            placeholder="Enter Room Photo URL"
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-base text-black font-semibold">
                                                Photo URL 2
                                            </span>
                                        </label>
                                        <input
                                        defaultValue={room?.photoURL2 || ""}
                                            type="url"
                                            name="photo2"
                                            placeholder="Enter Room Spot Photo URL"
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* User Email input */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-base text-black font-semibold">
                                            User Email
                                        </span>
                                    </label>
                                    <input
                                        value={user ? user?.email : ''}
                                        readOnly
                                        type="email"
                                        name="email"
                                        placeholder=""
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Description and Submit Button */}
                            <div className="md:col-span-2 space-y-6">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text text-base text-black font-semibold">
                                            Short Description
                                        </span>
                                    </label>
                                    <textarea
                                    defaultValue={room?.description || ""}
                                        placeholder="Short Description"
                                        name="description"
                                        className="textarea textarea-bordered w-full"
                                    ></textarea>
                                </div>
                                <input
                                    type="submit"
                                    value="Add Resort Room"
                                    className="btn w-full bg-sky-500 text-base text-white border-0 rounded-md"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
