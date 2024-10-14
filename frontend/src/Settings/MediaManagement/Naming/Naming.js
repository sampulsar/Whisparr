import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Alert from 'Components/Alert';
import FieldSet from 'Components/FieldSet';
import Form from 'Components/Form/Form';
import FormGroup from 'Components/Form/FormGroup';
import FormInputButton from 'Components/Form/FormInputButton';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import { inputTypes, kinds, sizes } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import NamingModal from './NamingModal';
import styles from './Naming.css';

const colonReplacementOptions = [
  {
    key: 'delete',
    get value() {
      return translate('Delete');
    }
  },
  {
    key: 'dash',
    get value() {
      return translate('ReplaceWithDash');
    }
  },
  {
    key: 'spaceDash',
    get value() {
      return translate('ReplaceWithSpaceDash');
    }
  },
  {
    key: 'spaceDashSpace',
    get value() {
      return translate('ReplaceWithSpaceDashSpace');
    }
  }
];

class Naming extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isNamingModalOpen: false,
      namingModalOptions: null
    };
  }

  //
  // Listeners

  onMovieNamingModalOpenClick = () => {
    this.setState({
      isNamingModalOpen: true,
      namingModalOptions: {
        name: 'standardMovieFormat',
        additional: true
      }
    });
  };

  onSceneNamingModalOpenClick = () => {
    this.setState({
      isNamingModalOpen: true,
      namingModalOptions: {
        name: 'standardSceneFormat',
        additional: true,
        isScene: true
      }
    });
  };

  onMovieFolderNamingModalOpenClick = () => {
    this.setState({
      isNamingModalOpen: true,
      namingModalOptions: {
        name: 'movieFolderFormat'
      }
    });
  };

  onSceneFolderNamingModalOpenClick = () => {
    this.setState({
      isNamingModalOpen: true,
      namingModalOptions: {
        name: 'sceneFolderFormat',
        isScene: true
      }
    });
  };

  onNamingModalClose = () => {
    this.setState({ isNamingModalOpen: false });
  };

  //
  // Render

  render() {
    const {
      advancedSettings,
      isFetching,
      error,
      settings,
      hasSettings,
      examples,
      examplesPopulated,
      onInputChange
    } = this.props;

    const {
      isNamingModalOpen,
      namingModalOptions
    } = this.state;

    const renameMovies = hasSettings && settings.renameMovies.value;
    const renameScenes = hasSettings && settings.renameScenes.value;
    const replaceIllegalCharacters = hasSettings && settings.replaceIllegalCharacters.value;

    const standardMovieFormatHelpTexts = [];
    const standardMovieFormatErrors = [];
    const movieFolderFormatHelpTexts = [];
    const movieFolderFormatErrors = [];
    const standardSceneFormatHelpTexts = [];
    const standardSceneFormatErrors = [];
    const sceneFolderFormatHelpTexts = [];
    const sceneFolderFormatErrors = [];

    if (examplesPopulated) {
      if (examples.movieExample) {
        standardMovieFormatHelpTexts.push(`${translate('Movie')}: ${examples.movieExample}`);
      } else {
        standardMovieFormatErrors.push({ get message() {
          return translate('MovieInvalidFormat');
        } });
      }

      if (examples.movieFolderExample) {
        movieFolderFormatHelpTexts.push(`${translate('Example')}: ${examples.movieFolderExample}`);
      } else {
        movieFolderFormatErrors.push({ get message() {
          return translate('InvalidFormat');
        } });
      }

      if (examples.sceneExample) {
        standardSceneFormatHelpTexts.push(`Example: ${examples.sceneExample}`);
      } else {
        standardSceneFormatErrors.push({ get message() {
          return translate('InvalidFormat');
        } });
      }

      if (examples.sceneFolderExample) {
        sceneFolderFormatHelpTexts.push(`Example: ${examples.sceneFolderExample}`);
      } else {
        sceneFolderFormatErrors.push({ get message() {
          return translate('InvalidFormat');
        } });
      }
    }

    return (
      <FieldSet legend={translate('Naming')}>
        {
          isFetching &&
            <LoadingIndicator />
        }

        {
          !isFetching && error &&
            <Alert kind={kinds.DANGER}>
              {translate('NamingSettingsLoadError')}
            </Alert>
        }

        {
          hasSettings && !isFetching && !error &&
            <Form>
              <FormGroup size={sizes.MEDIUM}>
                <FormLabel>{translate('RenameMovies')}</FormLabel>

                <FormInputGroup
                  type={inputTypes.CHECK}
                  name="renameMovies"
                  helpText={translate('RenameMoviesHelpText')}
                  onChange={onInputChange}
                  {...settings.renameMovies}
                />
              </FormGroup>

              <FormGroup size={sizes.MEDIUM}>
                <FormLabel>{translate('RenameScenes')}</FormLabel>

                <FormInputGroup
                  type={inputTypes.CHECK}
                  name="renameScenes"
                  helpText={translate('RenameMoviesHelpText')}
                  onChange={onInputChange}
                  {...settings.renameScenes}
                />
              </FormGroup>

              <FormGroup size={sizes.MEDIUM}>
                <FormLabel>{translate('ReplaceIllegalCharacters')}</FormLabel>

                <FormInputGroup
                  type={inputTypes.CHECK}
                  name="replaceIllegalCharacters"
                  helpText={translate('ReplaceIllegalCharactersHelpText')}
                  onChange={onInputChange}
                  {...settings.replaceIllegalCharacters}
                />
              </FormGroup>

              {
                replaceIllegalCharacters &&
                  <FormGroup>
                    <FormLabel>{translate('ColonReplacement')}</FormLabel>

                    <FormInputGroup
                      type={inputTypes.SELECT}
                      name="colonReplacementFormat"
                      values={colonReplacementOptions}
                      helpText={translate('ColonReplacementFormatHelpText')}
                      onChange={onInputChange}
                      {...settings.colonReplacementFormat}
                    />
                  </FormGroup>
              }

              {
                renameMovies &&
                  <FormGroup size={sizes.LARGE}>
                    <FormLabel>{translate('StandardMovieFormat')}</FormLabel>

                    <FormInputGroup
                      inputClassName={styles.namingInput}
                      type={inputTypes.TEXT}
                      name="standardMovieFormat"
                      buttons={<FormInputButton onPress={this.onMovieNamingModalOpenClick}>?</FormInputButton>}
                      onChange={onInputChange}
                      {...settings.standardMovieFormat}
                      helpTexts={standardMovieFormatHelpTexts}
                      errors={[...standardMovieFormatErrors, ...settings.standardMovieFormat.errors]}
                    />
                  </FormGroup>
              }

              <FormGroup
                advancedSettings={advancedSettings}
                isAdvanced={true}
              >
                <FormLabel>{translate('MovieFolderFormat')}</FormLabel>

                <FormInputGroup
                  inputClassName={styles.namingInput}
                  type={inputTypes.TEXT}
                  name="movieFolderFormat"
                  buttons={<FormInputButton onPress={this.onMovieFolderNamingModalOpenClick}>?</FormInputButton>}
                  onChange={onInputChange}
                  {...settings.movieFolderFormat}
                  helpTexts={[translate('MovieFolderFormatHelpText'), ...movieFolderFormatHelpTexts]}
                  errors={[...movieFolderFormatErrors, ...settings.movieFolderFormat.errors]}
                />
              </FormGroup>

              {
                renameScenes &&
                  <FormGroup size={sizes.LARGE}>
                    <FormLabel>{translate('StandardSceneFormat')}</FormLabel>

                    <FormInputGroup
                      inputClassName={styles.namingInput}
                      type={inputTypes.TEXT}
                      name="standardSceneFormat"
                      buttons={<FormInputButton onPress={this.onSceneNamingModalOpenClick}>?</FormInputButton>}
                      onChange={onInputChange}
                      {...settings.standardSceneFormat}
                      helpTexts={standardSceneFormatHelpTexts}
                      errors={[...standardSceneFormatErrors, ...settings.standardSceneFormat.errors]}
                    />
                  </FormGroup>
              }

              <FormGroup
                advancedSettings={advancedSettings}
                isAdvanced={true}
              >
                <FormLabel>{translate('SceneFolderFormat')}</FormLabel>

                <FormInputGroup
                  inputClassName={styles.namingInput}
                  type={inputTypes.TEXT}
                  name="sceneFolderFormat"
                  buttons={<FormInputButton onPress={this.onSceneFolderNamingModalOpenClick}>?</FormInputButton>}
                  onChange={onInputChange}
                  {...settings.sceneFolderFormat}
                  helpTexts={['Used when adding a new scene or moving scenes via the editor', ...sceneFolderFormatHelpTexts]}
                  errors={[...sceneFolderFormatErrors, ...settings.sceneFolderFormat.errors]}
                />
              </FormGroup>

              {
                namingModalOptions &&
                  <NamingModal
                    isOpen={isNamingModalOpen}
                    advancedSettings={advancedSettings}
                    {...namingModalOptions}
                    value={settings[namingModalOptions.name].value}
                    onInputChange={onInputChange}
                    onModalClose={this.onNamingModalClose}
                  />
              }
            </Form>
        }
      </FieldSet>
    );
  }

}

Naming.propTypes = {
  advancedSettings: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.object,
  settings: PropTypes.object.isRequired,
  hasSettings: PropTypes.bool.isRequired,
  examples: PropTypes.object.isRequired,
  examplesPopulated: PropTypes.bool.isRequired,
  onInputChange: PropTypes.func.isRequired
};

export default Naming;
