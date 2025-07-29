import { ButtonSolid, ButtonRegular } from "./Button"

export function CategoryComponents({SectionTitle}) {
    

    return(
        <div className="flex pt-4 w-full flex-col lg:flex-row lg:justify-between lg:items-center mx-0 lg:mx-4 lg:gap-4">
            <div>
            <h1 className='text-xl lg:text-2xl px-4 font-bold capitalize '>{SectionTitle}</h1>
            </div>
            
            <div className="flex flex-row justify-start text-sm lg:text-base font-normal text-nowrap 
            items-center overflow-x-auto p-4 ps-4 lg:mx-4 gap-4">
                <ButtonRegular text={'latest'}/>
                <ButtonSolid text={'recent'}/>
                <ButtonSolid text={'last mont'}/>
                <ButtonSolid text={'last year'}/>
            </div>
        </div>
    )
}
