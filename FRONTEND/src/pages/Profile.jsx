import React, { useState, useRef } from 'react'
import CreateIcon from '@mui/icons-material/Create';
import { useAuthStore } from '../stores/auth.store';
import Cropper from '../components/Cropper';
import api from '../lib/axios';
import { toast } from 'react-toastify';
import { useChatStore } from '../stores/chat.store';


export default function Profile({ toggleDark, dark }) {
    const { authUser } = useAuthStore();

    const [name, setName] = useState(authUser.name);

    const [image, setImage] = useState(null);

    const [modal, setModal] = useState(false);

    const [isSaving, setIsSaving] = useState(false);

    const { check, logout } = useAuthStore();

    const inputRef = useRef();

    const { friends } = useChatStore();


    function handleImageUpload(e) {
        if (!e.target.files[0].type.startsWith('image')) {
            e.target.value = null;
            toast.error("only images please ");
            return;
        }

        let fileReader = new FileReader()
        fileReader.onload = (ev) => {
            setImage(ev.target.result);
            setModal(true);
        }
        fileReader.readAsDataURL(e.target.files[0]);
    }

    function handleName(e) {
        setName(e.target.value);
    }

    function closeModal(croppedImage) {
        setModal(false);
        setImage(croppedImage);
        inputRef.current.value = null;

    }

    async function handleSave() {
        if (name.trim() == '') {
            toast.error("name can't be empty");
            return;
        }
        setIsSaving(true);
        toast.loading('uploading Image please wait');
        try {

            let form = new FormData()
            let response = await fetch(image);

            let imageBlob = await response.blob();

            form.append('name', name);
            form.append('avatar', imageBlob, 'userImage.png');

            const result = await api.putForm('/user', form);

            check();

        } catch (error) {
            console.log(error);

            toast.error('there was a problem try again later');
        }
        finally {
            setIsSaving(false);
            toast.dismiss();
        }

    }

    return (
        <>

            <div className='max-w-3xl grid grid-rows-1 grid-cols-1 w-full h-full mx-auto'>
                {modal &&
                    <div className='w-full h-full bg-base-300 glass row-start-1 row-end-1 z-10 col-end-1 col-start-1'>
                        <Cropper image={image} closeModal={closeModal} />
                    </div>}

                <div className='w-full  glass px-2.5 flex flex-col gap-4 items-center h-full row-start-1 row-end-1 col-end-1 col-start-1'>
                    <div className='flex justify-between items-center'>
                        <p className='md:text-2xl font-extrabold'>user Profile </p>
                    </div>
                    <div className='w-44 h-44 rounded-full grid place-content-center'>
                        <div className='w-40 h-40 overflow-hidden rounded-full bg-blue border-6 border-base-content'>
                            <img draggable={false} className='' src={image || authUser.avatar} alt="" />
                        </div>
                    </div>
                    <div className='text-center'>
                        <p className='text-base-content/50'>change your picture </p>
                        <input id='upload-avatar-input' accept='image/*' disabled={isSaving} ref={inputRef} onInput={handleImageUpload} type="file" className="file-input bg-transparent file-input-sm" />
                    </div>
                    <div className="stats shadow">
                        <div className="stat">
                            <div className="stat-title">Total Friends</div>
                            <div className="stat-value">{friends?.length || ""}</div>
                            <div className="stat-desc">visit the people tab to add more</div>
                        </div>
                    </div>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">What is your name?</legend>
                        <input disabled={isSaving} id='name' required value={name} onChange={handleName} type="text" className="input shadow bg-transparent focus:outline-0" placeholder="Type here" />
                    </fieldset>
                    <button disabled={isSaving} onClick={handleSave} className="btn bg-transparent shadow border-base-content/40 px-17">Save Edits</button>
                    <p>theme                     <input type="checkbox" defaultValue={dark} onChange={toggleDark} className="toggle toggle-neutral" id='theme' />
                    </p>
                    <a role='button'
                        className='text-base-content/50
                      hover:text-red-400
                       cursor-pointer'
                        onClick={logout}>signout</a>
                </div>
            </div>
        </>
    )
}
