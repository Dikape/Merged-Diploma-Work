import React, {Component, PropTypes} from 'react';
import Helmet from 'react-helmet';
import { withGoogleMap, GoogleMap, Marker, Polygon, InfoWindow, Circle } from 'react-google-maps';
import DrawingManager from 'react-google-maps/lib/drawing/DrawingManager';
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
  toggleMarkerDisplay,
  setRegionToDisplay,
  setCategoriesToDisplay,
  setPeopleCategoriesToDisplay,
  setContractTypeToDisplay
} from 'redux/modules/map';
import isInPolygon from '../../helpers/isInPolygon';

let currentCenter = {};

const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={10}
    defaultCenter={{ lat: 50.454090, lng: 30.524743 }}
    onClick={props.onMapClick}
    ref={(map) => {
      if (map) {
        if (currentCenter !== props.mapCenter) {
          map.panTo({ lat: Number(props.mapCenter.lat), lng: Number(props.mapCenter.lng) });
        }
        currentCenter = props.mapCenter;
      }
    }}
  >
    {props.regions.map((region) => {
      const path = region.map_points.map(point => ({ lat: Number(point.map_lat), lng: Number(point.map_lon) }));
      if (region.id === props.regionToDisplay) {
        return (
          <Polygon
            paths={path} onClick={(event) => { console.log('polygon', event, 'index = '); }}
            options={{
              strokeWeight: '1',
              fillColor: 'gray'
            }}
          />
        );
      }
    })}
    {props.markers.map((marker, index) => {
      const position = {
        lat: Number(marker.map_points[0].map_lat),
        lng: Number(marker.map_points[0].map_lon)
      };
      const contractType = props.contractTypes.find(element => Number(element.id) === Number(marker.contract_type));
      const holder = props.holders.find(element => Number(element.id) === Number(marker.holder));
      if (marker.region === props.regionToDisplay && props.categoriesToDisplay.includes(marker.category)) {
        const iconElement = {
          url: props.categories.find(category => category.id === marker.category).img_small,
        };
        const returnObject = (
          <Marker
            position={position}
            onRightClick={() => props.onMarkerRightClick(marker.id)}
            onClick={() => props.onMarkerClick(marker.id)}
            icon={iconElement}
            key={`current-marker-${index}`}
          >
            {marker.showInfo && (
              <InfoWindow onCloseClick={() => props.onMarkerClick(marker.id)}>
                <div className="info-container">
                  <div className="name">{marker.name}</div>
                  <div className="description">{marker.description}</div>
                  <div className="holder"><div className="title">Власник:</div>{holder.title}</div>
                  <div className="contract-type"><div className="title">Тип контракту:</div>{contractType.title}</div>
                  <div className="price"><div className="title">Ціна:</div>{marker.price} грн.</div>
                  <div className="metrics"><div className="title">Площа:</div>{marker.metrics} м<sup>2</sup></div>
                </div>
              </InfoWindow>
            )}
          </Marker>
        );
        if (props.contractTypesToDisplay && props.contractTypesToDisplay.length !== 0) {
          if (props.contractTypesToDisplay.includes(marker.contract_type)) {
            return (
              returnObject
            );
          }
        } else {
          return (
            returnObject
          );
        }
      }
    })}
    {props.polygons.map((polygon, index) => {
      const path = polygon.map_points.map(point => ({ lat: Number(point.map_lat), lng: Number(point.map_lon) }));
      if (polygon.region === props.regionToDisplay && props.categoriesToDisplay.includes(polygon.category)) {
        return (
          <Polygon
            paths={path} onClick={(event) => { console.log('polygon', event, 'index = ', index); }}
            options={{
              strokeWeight: '1',
              fillColor: 'gray'
            }}
          />
        );
      }
    })}
    {props.peoples.map((people) => {
      const position = ({ lat: Number(people.map_lat), lng: Number(people.map_lon) });
      console.log('prople', people);
      if (people.region === props.regionToDisplay && props.peopleCategoriesToDisplay.includes(people.category)) {
        const peopleCategory = props.peopleCategories.find(item => item.id === people.category);
        return (
          <Circle
            radius={people.count ? people.count / 20 : 0}
            center={position}
            fillColor={'red'}
            options={{
              strokeWeight: '1',
              fillColor: peopleCategory && peopleCategory.color ? peopleCategory.color : 'grey'
            }}
          />
        );
      }
    })}
    <DrawingManager
      onCircleComplete={(aa, bb, cc) => { console.log('a,b,c onCircleComplete', aa, bb, cc); }}
      onMarkerComplete={(event) => {
        const point = {
          lat: event.position.lat(),
          lng: event.position.lng()
        };
        const polygonPoints = props.regions.find(region => region.id === props.regionToDisplay).map_points.
        map(element => ({
          lat: Number(element.map_lat),
          lng: Number(element.map_lon)
        }));
        if (!isInPolygon(point, polygonPoints)) {
          event.setVisible(false);
        }
      }}
      onOverlayComplete={(aa, bb, cc) => { console.log('a,b,c onOverlayComplete', aa, bb, cc); }}
    />
  </GoogleMap>
));

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
    contractTypesToDisplay: state.map.contractTypesToDisplay,
  })
)
export default class Map extends Component {
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
    peopleCategoriesToDisplay: PropTypes.array,
    contractTypesToDisplay: PropTypes.array,
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
    contractTypesToDisplay: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      someState: false,
      displayRegionsList: true,
      markers: []
    };
  }

  handleMapClicked(event) {
    const { someState } = this.state;
    const latitudeClicked = event && event.latLng && event.latLng.lat() || null;
    const longitudeClicked = event && event.latLng && event.latLng.lng() || null;
    console.log('latitudeClicked=', latitudeClicked, ', longitudeClicked=', longitudeClicked, someState);
  }

  render() {
    const {
      regions, objects, categories, contractTypes, holders, regionToDisplay, categoriesToDisplay,
      ownershipForms, peopleCategories, peoples, mapCenter, peopleCategoriesToDisplay,
      contractTypesToDisplay
    } = this.props;
    const dispatch = this.context.store.dispatch;
    const markersList = objects.filter(element => element.map_points.length === 1);
    const polygonsList = objects.filter(element => element.map_points.length !== 1);
    console.log('mapCenter', mapCenter);
    require('./Map.scss');
    return (
      <div className="global-maps-container">
        <Helmet title="Region info"/>
        <div className="map-container">
          <GettingStartedGoogleMap
            containerElement={
              <div style={{ height: `100%` }} />
            }
            mapElement={
              <div style={{ height: `100%` }} />
            }
            onMapClick={(event) => { this.handleMapClicked(event); }}
            markers={markersList}
            polygons={polygonsList}
            regions={regions}
            categories={categories}
            contractTypes={contractTypes}
            holders={holders}
            ownershipForms={ownershipForms}
            peopleCategories={peopleCategories}
            peoples={peoples}
            mapCenter={mapCenter}
            regionToDisplay={regionToDisplay}
            categoriesToDisplay={categoriesToDisplay}
            peopleCategoriesToDisplay={peopleCategoriesToDisplay}
            onMarkerClick={(index) => {
              dispatch(toggleMarkerDisplay(index));
            }}
            contractTypesToDisplay={contractTypesToDisplay}
          />
        </div>
        <div className="filters-container">
          <div className="regions-list">
            <div className="title">Список регіонів</div>
            <div className="list">
              {regions && regions.length !== 0 ? regions.map(element =>
                <div
                  className={`region-item ${element.id === regionToDisplay ? 'active' : ''}`}
                  onClick={() => { dispatch(setRegionToDisplay(element.center_lat, element.center_lon, element.id)); }}
                >
                  {element.title}
                </div>
              ) : ''}
            </div>
          </div>
          <div className="regions-list">
            <div className="title">Типи договорів</div>
            <div className="list">
              {contractTypes && contractTypes.length !== 0 ?
                contractTypes.filter(element => objects.filter(object => object.contract_type === element.id
                && object.region === regionToDisplay).length !== 0).map(element =>
                  <div
                    className={`region-item ${contractTypesToDisplay.includes(element.id) ? 'active' : ''}`}
                    onClick={() => { dispatch(setContractTypeToDisplay(element.id)); }}
                  >
                    {element.title}
                  </div>
              ) : ''}
            </div>
          </div>
          <div className="categories-list">
            <div className="title">Категорії об'єктів</div>
            <div className="list">
              {categories && categories.length !== 0 ?
                categories.filter(element => objects.filter(object => object.category === element.id
                  && object.region === regionToDisplay).length !== 0).map(element =>
                    <div
                      className={`category-item ${categoriesToDisplay && categoriesToDisplay.length !== 0 &&
                       categoriesToDisplay.includes(element.id) ? 'active' : ''}`}
                      onClick={() => { dispatch(setCategoriesToDisplay(element.id)); }}
                    >
                      <div className="image-place">
                        <img src={element.marker_picture} />
                      </div>
                      {element.title}
                    </div>
              ) : ''}
            </div>
          </div>
          <div className="people-categories-list">
            <div className="title">Категорії людей</div>
            <div className="list">
              {peopleCategories && peopleCategories.length !== 0 ?
                peopleCategories.filter(element => peoples.filter(people => people.category === element.id
                && people.region === regionToDisplay).length !== 0).map(element =>
                  <div
                    className={`people-category-item ${peopleCategoriesToDisplay
                      && peopleCategoriesToDisplay.length !== 0 &&
                       peopleCategoriesToDisplay.includes(element.id) ? 'active' : ''}`}
                    onClick={() => { dispatch(setPeopleCategoriesToDisplay(element.id)); }}
                  >
                    {element.title}
                  </div>
                ) : ''}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
