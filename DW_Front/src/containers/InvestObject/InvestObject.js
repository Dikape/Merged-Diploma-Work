import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import {
  loadRegions,
  loadObjects,
  loadCategories,
  loadContractTypes,
  loadHolders,
  loadOwnershipForms,
  loadPeopleCategories,
  loadPeoples,
} from 'redux/modules/map';
import Lightbox from 'react-image-lightbox';

@asyncConnect([{
  promise: ({ store: { dispatch } }) => {
    const promises = [];

    promises.push(dispatch(loadRegions()));
    promises.push(dispatch(loadObjects()));
    promises.push(dispatch(loadCategories()));
    promises.push(dispatch(loadContractTypes()));
    promises.push(dispatch(loadHolders()));
    promises.push(dispatch(loadOwnershipForms()));
    promises.push(dispatch(loadPeopleCategories()));
    promises.push(dispatch(loadPeoples()));

    return Promise.all(promises);
  }
}])
@connect(
  state => ({
    regions: state.map.regions,
    objects: state.map.objects,
    categories: state.map.categories,
    contractTypes: state.map.contractTypes,
    holders: state.map.holders,
    ownershipForms: state.map.ownershipForms,
    peopleCategories: state.map.peopleCategories,
    peoples: state.map.peoples,
    mapCenter: state.map.mapCenter,
    regionToDisplay: state.map.regionToDisplay,
    categoriesToDisplay: state.map.categoriesToDisplay,
    peopleCategoriesToDisplay: state.map.peopleCategoriesToDisplay,
  })
)
export default class InvestObject extends Component {
  static propTypes = {
    objects: PropTypes.array,
    regions: PropTypes.array,
    holders: PropTypes.array,
    contractTypes: PropTypes.array,
    categories: PropTypes.array,
    params: PropTypes.object,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  static defaultProps = {
    objects: [],
    regions: [],
    holders: [],
    contractTypes: [],
    categories: [],
    params: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      isLightBoxOpen: false
    };
  }

  render() {
    const { regions, objects, categories, params, contractTypes, holders } = this.props;
    console.log(' regions, objects, categories, params, contractTypes, holders ',
      regions, objects, categories, params, contractTypes, holders);
    const { isLightBoxOpen } = this.state;
    const currentObject = objects.find(object => Number(object.id) === Number(params.id));
    require('./InvestObject.scss');
    return (
      <div className="global-invest-object-container">
        <Helmet title="Region info"/>
        <div className="region-description">
          <div className="left-part">
            <div className="region-image" onClick={() => this.setState({ isLightBoxOpen: true })}>
              <img src={currentObject.image ? currentObject.image : ''} />
            </div>
            <div className="show-more" onClick={() => this.setState({ isLightBoxOpen: true })}>
              Натисніть на зображення для збільшення.
            </div>
            {isLightBoxOpen ?
              <Lightbox
                mainSrc={currentObject.image ? currentObject.image : ''}
                onCloseRequest={() => this.setState({ isLightBoxOpen: false })}
              />
            : ''}
          </div>
          <div className="right-part">
            <div className="region-title">
              {currentObject && currentObject.name ? currentObject.name : ''}
            </div>
            <div className="region-description" style={{ marginBottom: '20px' }}>
              {currentObject && currentObject.description ? currentObject.description : ''}
            </div>
            <div className="count">
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Категорія:</span>
                <span>{categories && categories.length !== 0
                  ? categories.find(item => item.id === currentObject.category).title
                : ''}</span>
            </div>
            <div className="count">
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Власник:</span>
                <span>{holders && holders.length !== 0
                  ? holders.find(item => item.id === currentObject.holder).title
                  : ''}</span>
            </div>
            <div className="count">
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Тип контракту:</span>
                <span>{contractTypes && contractTypes.length !== 0
                  ? contractTypes.find(item => item.id === currentObject.contract_type).title
                  : ''}</span>
            </div>
            <div className="count">
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Ціна:</span>
              <span>{currentObject.price ? currentObject.price : 0}грн.</span>
            </div>
            <div className="count">
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Площа:</span>
              <span>{currentObject.metrics ? currentObject.metrics : 0}м<sup>2</sup>.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
