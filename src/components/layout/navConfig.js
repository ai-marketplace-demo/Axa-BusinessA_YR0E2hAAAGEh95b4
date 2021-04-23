import * as BiIcons from "react-icons/bi";
import * as BsIcons from "react-icons/bs";
import * as AiIcons from "react-icons/ai";
import * as SiIcon from "react-icons/si";
import * as MdIcons from "react-icons/md";
// import SagemakerStudioSvg from "../../assets/aws_assets/sagemaker/Res_Amazon-Sagemaker_Model_16_Light.svg"
import React from "react";

const navConfig = [

    {
        label: <b>Discover & Govern</b>,
        icon: <BiIcons.BiSearch/>,
        items: [
            {
                label: 'Catalog',
                icon: <BsIcons.BsBook/>,
                link: '/discover'
            },
            {
                label: 'Contribute',
                icon: <BsIcons.BsFolder/>,
                link: '/datasets'
            },



            {
                label: 'Organize',
                icon: <BsIcons.BsTag/>,
                link: '/glossaries'
            }

        ]
    },

    {
        label: <b>Play <i>!</i></b>,
        icon: <BsIcons.BsPlay/>,
        items: [
            {
                label: 'Worksheets',
                icon: <AiIcons.AiOutlineExperiment/>,
                link: '/worksheets'
            },
            {
                label: 'Notebooks',
                icon: <BsIcons.BsFileCode/>,
                link: '/notebooks'
            },
            // {
            //     label: 'Sagemaker Studio',
            //     icon: <img src={SagemakerStudioSvg} /> ,
            //     link: '/sagemakerstudio/userprofiles'
            // },
            {
                label: 'Dashboards',
                link: '/dashboards',
                icon: <MdIcons.MdShowChart/>
            },
            {
                label: 'Pipelines',
                icon: <BsIcons.BsGear/>,
                link: '/pipelines'
            },
            {
                label: 'Workflows',
                icon: <SiIcon.SiApacheairflow/>,
                link: '/workflows'
            },

        ]

    },
    {
        label: <b>Admin</b>,
        icon: <BsIcons.BsShield/>,
        items: [
            {
                label: 'Organizations',
                icon: <BsIcons.BsHouse/>,
                link: '/organizations'
            },
            {
                label: "Environments",
                icon: <BsIcons.BsCloud/>,
                link: '/environments'
            }
        ]
    }
]

export default navConfig;
