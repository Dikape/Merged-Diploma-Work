import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import { Link } from 'react-router';
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
import CalculateInvestmentForm from './CalculateInvestmentForm';

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
export default class Region extends Component {
  static propTypes = {
    regions: PropTypes.array,
    objects: PropTypes.array,
    categories: PropTypes.array,
    contractTypes: PropTypes.array,
    holders: PropTypes.array,
    ownershipForms: PropTypes.array,
    peopleCategories: PropTypes.array,
    peoples: PropTypes.array,
    mapCenter: PropTypes.object,
    regionToDisplay: PropTypes.number,
    categoriesToDisplay: PropTypes.array,
    params: PropTypes.object,
    peopleCategoriesToDisplay: PropTypes.array,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  static defaultProps = {
    regions: [],
    objects: [],
    categories: [],
    contractTypes: [],
    holders: [],
    ownershipForms: [],
    peopleCategories: [],
    peoples: [],
    mapCenter: {},
    regionToDisplay: null,
    categoriesToDisplay: [],
    peopleCategoriesToDisplay: [],
    params: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isLightBoxOpen: false,
      isObjectsDisplay: false,
      isInvestmentFormDisplay: false,
      isPeoplesObjectsDisplay: false,
      objectsCategorySelected: null,
      peoplesCategorySelected: null,
      objectSelected: null,
      peopleSelected: null
    };
  }

  setObjectsFromCategoryToDisplay(categoryId) {
    const { objectsCategorySelected } = this.state;
    let category = categoryId;
    if (objectsCategorySelected === categoryId) {
      category = null;
    }
    this.setState({ objectsCategorySelected: category });
  }

  setPeoplesCategoryToDisplay(categoryId) {
    const { peoplesCategorySelected } = this.state;
    let category = categoryId;
    if (peoplesCategorySelected === categoryId) {
      category = null;
    }
    this.setState({ peoplesCategorySelected: category });
  }

  setObjectToDisplay(objectId) {
    const { objectSelected } = this.state;
    let object = objectId;
    if (objectSelected === objectId) {
      object = null;
    }
    this.setState({ objectSelected: object });
  }

  setPeopleToDisplay(peopleId) {
    const { peopleSelected } = this.state;
    let people = peopleId;
    if (peopleSelected === peopleId) {
      people = null;
    }
    this.setState({ peopleSelected: people });
  }

  handleMapClicked(event) {
    const { someState } = this.state;
    const latitudeClicked = event && event.latLng && event.latLng.lat() || null;
    const longitudeClicked = event && event.latLng && event.latLng.lng() || null;
    console.log('latitudeClicked=', latitudeClicked, ', longitudeClicked=', longitudeClicked, someState);
  }

  render() {
    const { regions, objects, categories, peopleCategories, peoples, params, contractTypes, holders } = this.props;
    const { isLightBoxOpen, isObjectsDisplay, objectsCategorySelected, peoplesCategorySelected,
      objectSelected, peopleSelected, isPeoplesObjectsDisplay, isInvestmentFormDisplay } = this.state;
    const currentRegion = regions.find(region => Number(region.id) === Number(params.id));
    require('./Region.scss');
    return (
      <div className="global-region-container">
        <Helmet title="Region info"/>
        <div className="region-description">
          <div className="left-part">
            <div className="region-image" onClick={() => this.setState({ isLightBoxOpen: true })}>
              <img src={currentRegion.image} />
            </div>
            <div className="show-more" onClick={() => this.setState({ isLightBoxOpen: true })}>
              Натисніть на зображення для збільшення.
            </div>
            {isLightBoxOpen ?
              <Lightbox
                mainSrc={currentRegion.image}
                onCloseRequest={() => this.setState({ isLightBoxOpen: false })}
              />
            : ''}
          </div>
          <div className="right-part">
            <div className="region-title">
              {currentRegion && currentRegion.title ? currentRegion.title : ''}
            </div>
            <div className="region-description">
              {currentRegion && currentRegion.description ? currentRegion.description : ''}
            </div>
            <div className="region-center">
              <span>Центр регіону:</span>
              {currentRegion && currentRegion.center_city ? currentRegion.center_city : 'Не вказано'}
            </div>
          </div>
        </div>
        <div className="region-objects">
          <div
            className={`title ${isObjectsDisplay ? 'to-top' : ''}`}
            onClick={() => { this.setState({ isObjectsDisplay: !isObjectsDisplay }); }}
          >
            Категорії об'єктів, що знаходяться на регіоні
          </div>
          <div className={`objects-list ${isObjectsDisplay ? 'display' : ''}`}>
            {categories && categories.length !== 0 ? categories.
              filter(category => objects.filter(obj => obj.category === category.id
                && Number(obj.region) === Number(params.id)).length !== 0).map(category =>
                  <div className="category-item">
                    <div
                      className={`category-title ${category.id === objectsCategorySelected ? 'active' : ''}`}
                      onClick={() => {
                        this.setObjectsFromCategoryToDisplay(category.id);
                      }}
                    >
                      {category.title}
                    </div>
                    <div className={`category-item-list ${objectsCategorySelected === category.id ? 'display' : ''}`}>
                      {objectsCategorySelected === category.id ? objects.filter(object => Number(object.region) === Number(params.id)
                        && object.category === objectsCategorySelected).map(item =>
                          <div className="current-object">
                            <div
                              className={`object-title ${objectSelected === item.id ? 'active' : ''}`}
                              onClick={() => { this.setObjectToDisplay(item.id); }}
                            >
                              <Link to={`/invest_object/${item.id}`}>{item.name ? item.name : ''}</Link>
                            </div>
                            <div className={`object-description ${objectSelected === item.id ? 'display' : ''}`}>
                              {item.id === objectSelected && objects && objects.length !== 0 ?
                                objects.filter(object => object.id === objectSelected).map(currentObject =>
                                  <div className="object-info">
                                    <div className="object-image">
                                      <img src={currentObject.image} />
                                    </div>
                                    <div className="object-text">
                                      <div className="description">{currentObject.description}</div>
                                      <div className="stat">
                                        <div>
                                          <div className="key">Ціна:</div>
                                          <div className="value">{currentObject.price} грн.</div>
                                        </div>
                                        <div>
                                          <div className="key">Площа:</div>
                                          <div className="value">{currentObject.metrics} м<sup>2</sup></div>
                                        </div>
                                        <div>
                                          <div className="key">Власник:</div>
                                          <div className="value">{holders.find(holder => holder.id === currentObject.holder).title}</div>
                                        </div>
                                        <div>
                                          <div className="key">Тип договору:</div>
                                          <div className="value">{contractTypes.find(contract => contract.id === currentObject.contract_type).title}</div>
                                        </div>
                                      </div>
                                    </div>

                                  </div>
                              ) : ''}
                            </div>
                          </div>
                      ) : ''}
                    </div>
                  </div>
            ) : ''}
          </div>
        </div>
        <div className="region-demography">
          <div
            className={`title ${isPeoplesObjectsDisplay ? 'to-top' : ''}`}
            onClick={() => { this.setState({ isPeoplesObjectsDisplay: !isPeoplesObjectsDisplay }); }}
          >
            Демографія, поточного регіону
          </div>
          <div className={`objects-list ${isPeoplesObjectsDisplay ? 'display' : ''}`}>
            {peopleCategories && peopleCategories.length !== 0 ? peopleCategories.
            filter(category => peoples.filter(people => people.category === category.id
            && Number(people.region) === Number(params.id)).length !== 0).map(category =>
              <div className="category-item">
                <div
                  className={`category-title ${category.id === peoplesCategorySelected ? 'active' : ''}`}
                  onClick={() => {
                    this.setPeoplesCategoryToDisplay(category.id);
                  }}
                >
                  {category.title}
                </div>
                <div className={`category-item-list ${peoplesCategorySelected === category.id ? 'display' : ''}`}>
                  {peoplesCategorySelected === category.id ? peoples.filter(people => Number(people.region) === Number(params.id)
                  && people.category === peoplesCategorySelected).map(item =>
                    <div className="current-object">
                      <div
                        className={`object-title ${objectSelected === item.id ? 'active' : ''}`}
                        onClick={() => { this.setPeopleToDisplay(item.id); }}
                      >
                        {item.title}
                      </div>
                      <div className={`object-description ${peopleSelected === item.id ? 'display' : ''}`}>
                        {item.id === peopleSelected && peoples && peoples.length !== 0 ?
                          peoples.filter(people => people.id === peopleSelected).map(currentPeople =>
                            <div className="object-info">
                              <div className="object-text">
                                <div className="description">{currentPeople.description}</div>
                                <div className="stat">
                                  <div>
                                    <div className="key">Кількість:</div>
                                    <div className="value">{currentPeople.count} чол.</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : ''}
                      </div>
                    </div>
                  ) : ''}
                </div>
              </div>
            ) : ''}
          </div>
        </div>
        <div className="input-form">
          <div
            className="title"
            onClick={() => { this.setState({ isInvestmentFormDisplay: !isInvestmentFormDisplay }); }}
          >
            Визначення найкращого капіталовкладення
          </div>
          <CalculateInvestmentForm
            display={isInvestmentFormDisplay}
            categoriesList={categories && categories.length !== 0 ? categories.filter(category =>
              objects.filter(obj => obj.category === category.id
                && Number(obj.region) === Number(params.id)).length !== 0) : []}
            markers={objects}
            currentRegion={regions.find(region => Number(region.id) === Number(params.id))}
          />
        </div>
      </div>
    );
  }
}
