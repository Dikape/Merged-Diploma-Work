import React, {Component, PropTypes} from 'react';
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
    searchQuery: state.search.searchQuery,
    searchResults: state.search.searchResults,
    peopleCategories: state.map.peopleCategories,
    ownershipForms: state.map.ownershipForms,
    regions: state.map.regions
  })
)
export default class Search extends Component {
  static propTypes = {
    searchQuery: PropTypes.String,
    searchResults: PropTypes.Array,
    peopleCategories: PropTypes.array,
    regions: PropTypes.array,
    ownershipForms: PropTypes.array,
  };

  static defaultProps = {
    searchQuery: '',
    searchResults: '',
    regions: [],
    peopleCategories: [],
    ownershipForms: [],
  };


  render() {
    const { searchQuery, searchResults, peopleCategories, regions, ownershipForms } = this.props;
    require('./Search.scss');
    return (
      <div className="container search-container">
        {searchResults && searchResults.message
          ?
            <div className="title">За вашим запитом <span>"{searchQuery}"</span> не було знайдено жодних результатів</div>
          :
            <div className="title">За вашим запитом <span>"{searchQuery}"</span> було отримано наступні результати:</div>
        }
        {searchResults && searchResults.length !== 0 ?
          <div className="search-results">
            {searchResults && searchResults.region ? searchResults.region.map(region =>
              <div className="item">
                <div className="type"><span className="type">Регіони</span> -
                  <Link to={`/region/${region.id}`}>{region.title ? region.title : ''}</Link>
                </div>
                {/* <div className="description">Сховати детальну інформацію</div> */}
                <div className="ololo">
                  <div className="description">{region.description ? region.description : ''}</div>
                  <div className="count">
                    <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Центр регіону:</span>
                    <span>{region.center_city ? region.center_city : ''}</span>
                  </div>
                </div>
              </div>
            ) : ''}
          </div>
        : ''}
        {searchResults && searchResults.length !== 0 ?
          <div className="search-results">
            {searchResults && searchResults.people ? searchResults.people.map(people =>
              <div className="item">
                <div className="type">
                  <span className="type">Демографічні показники регіону</span> - {people.title ? people.title : ''}
                </div>
                <div className="ololo">
                  <div className="description">{people.description ? people.description : ''}</div>
                  <div className="count">
                    <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Кількість людей:</span>
                    <span>{people.count ? people.count : 0}</span>
                  </div>
                  <div className="count">
                    <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Категорія людей:</span>
                    <span>{peopleCategories && peopleCategories.length !== 0
                      ? peopleCategories.find(item => item.id === people.category).title
                    : ''}
                    </span>
                  </div>
                  <div className="count">
                    <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Регіон проживання:</span>
                    <span>{regions && regions.length !== 0
                      ? regions.find(item => item.id === people.region).title
                    : ''}</span>
                  </div>
                </div>
              </div>
            ) : ''}
          </div>
          : ''}
        {searchResults && searchResults.length !== 0 ?
          <div className="search-results">
            {searchResults && searchResults.investmentobject ? searchResults.investmentobject.map(object =>
              <div className="item">
                <div className="type">
                  <span className="type">Інвестиційні об'єкти</span> -
                    <Link to={`/invest_object/${object.id}`}>{object.name ? object.name : ''}</Link>
                </div>
                <div className="ololo">
                  <div className="description">{object.description ? object.description : ''}</div>
                  <div className="count">
                    <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Ціна:</span>
                    <span>{object.price ? object.price : 0}грн.</span>
                  </div>
                  <div className="count">
                    <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Площа:</span>
                    <span>{object.metrics ? object.metrics : 0}м<sup>2</sup>.</span>
                  </div>
                </div>
              </div>
            ) : ''}
          </div>
          : ''}
        {searchResults && searchResults.length !== 0 ?
          <div className="search-results">
            {searchResults && searchResults.objectholder ? searchResults.objectholder.map(object =>
              <div className="item">
                <div className="type">
                  <span className="type">Балансоутримувачі</span> - {object.title ? object.title : ''}
                </div>
                <div className="ololo">
                  <div className="count">
                    <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Адреса:</span>
                    <span>{object.address ? object.address : 0}</span>
                  </div>
                  <div className="count">
                    <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Контакти:</span>
                    <span>{object.contacts ? object.contacts : 0}</span>
                  </div>
                  <div className="count">
                    <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Форми власності:</span>
                    <span>{ownershipForms && ownershipForms.length !== 0
                      ? ownershipForms.find(item => item.id === object.ownership).title
                      : ''}</span>
                  </div>
                </div>
              </div>
            ) : ''}
          </div>
          : ''}
      </div>
    );
  }
}
