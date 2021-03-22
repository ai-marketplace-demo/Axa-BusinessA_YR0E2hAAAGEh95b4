import React from "react";
import PropTypes from 'prop-types';
import {If, Then} from "react-if";
import {Link} from "react-router-dom";
import {AssetCardFooter, CardCircle, CardLayout, CardTag} from "./styles";
import * as BsIcons from "react-icons/bs";
import HumanDate from "../dates/HumanDate";


const CardDetailItem = ({icon, name, target}) => {
    return <div
        style={{display: 'grid', columnGap: '5px', placeItems: 'center start ', gridTemplateColumns: '1fr 2fr 2fr'}}>
        <div>{icon}</div>
        <div>{name}</div>
        <div>{target}</div>
    </div>
}
const CardDetails = ({details}) => {
    return <div style={{fontSize: 'x-small', display: 'grid', gridTemplateRows: '1fr'}}>

        {
            details.map((detail) => {
                return <CardDetailItem {...detail}/>
            })
        }
    </div>
}

const AssetCard = ({commentable, commentsLink,collectionable, label, owner, description, tags, created, details, uri, link}) => {
    return <CardLayout>
        <div style={{
            columnGap: '0.3rem',
            placeItems: 'center start',
            display: "grid",
            gridTemplateColumns: '1fr 3fr 1fr'
        }}>
            <CardCircle>{label?label[0]:"O"}</CardCircle>
            <Link to={`${link}`}>
                <b>{label}</b>
            </Link>
        </div>
        <div style={{fontSize: 'x-small'}}><b>{description || `No description provided`}</b></div>
        <div style={{
            placeItems: 'center start',
            fontSize: 'x-small',
            columnGap: '0.3rem',
            display: "grid",
            gridTemplateColumns: '1fr 1fr'
        }}>
            <div>{owner}</div>
            <HumanDate d={created}/>
        </div>
        <div style={{display: "grid", gridTemplateRows: '1fr', gridTemplateColumns: 'repeat(5,auto)'}}>
            {
                tags && tags.map((tag) => {
                    return <CardTag>{tag}</CardTag>
                })
            }
        </div>
        <CardDetails details={details || []}/>
        <AssetCardFooter>
            <div style={{
                display: "grid",
                columnGap: '12px',
                placeItems: 'center start',
                gridTemplateColumns: '0.1fr 1fr'
            }}>
                <If condition={commentable}>
                    <Then>
                        <BsIcons.BsChat size={`8`}/>
                        <div style={{fontSize: 'xx-small'}}>
                            <Link to={`${commentsLink&&commentsLink({uri})}`}>
                                Comments
                            </Link>
                        </div>
                    </Then>
                </If>

            </div>
            <div style={{
                display: "grid",
                columnGap: '12px',
                placeItems: 'center start',
                gridTemplateColumns: '0.1fr 1fr'
            }}>
                <If condition={collectionable}>
                    <Then>
                        <BsIcons.BsHeart size={`8`}/>
                        <div style={{fontSize: 'xx-small'}}>Favorite</div>
                    </Then>
                </If>
            </div>

        </AssetCardFooter>
    </CardLayout>

}


AssetCard.propTypes = {
    label: PropTypes.string,
    created: PropTypes.string,
    owner: PropTypes.string,
    assetLink: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.array,
    details: PropTypes.array,
    commentsLink: PropTypes.string
}


export default AssetCard;
