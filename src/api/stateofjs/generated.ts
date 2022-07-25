import { useQuery, UseQueryOptions } from 'react-query';
export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch("https://api.stateofjs.com/graphql", {
    method: "POST",
    ...({"headers":{"Content-Type":"application/json"}}),
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

/** Other Types (get rid of this later?) */
export type Age = {
  __typename?: 'Age';
  all_years?: Maybe<Array<Maybe<DemographicsItemYear>>>;
  keys?: Maybe<Array<Maybe<AgeRange>>>;
  year?: Maybe<DemographicsItemYear>;
};


/** Other Types (get rid of this later?) */
export type AgeYearArgs = {
  year: Scalars['Int'];
};

export enum AgeRange {
  Range_10_18 = 'range_10_18',
  Range_18_24 = 'range_18_24',
  Range_25_34 = 'range_25_34',
  Range_35_44 = 'range_35_44',
  Range_45_54 = 'range_45_54',
  Range_55_64 = 'range_55_64',
  RangeLessThan_10 = 'range_less_than_10',
  RangeMoreThan_65 = 'range_more_than_65'
}

export enum BracketId {
  OpinionsCssPainPoints = 'opinions__css_pain_points',
  OpinionsCurrentlyMissingFromCss = 'opinions__currently_missing_from_css',
  OpinionsCurrentlyMissingFromJs = 'opinions__currently_missing_from_js',
  OpinionsJsPainPoints = 'opinions__js_pain_points',
  ToolsOthersToolEvaluation = 'tools_others__tool_evaluation'
}

export enum BracketKey {
  Combined = 'combined',
  Round1 = 'round1',
  Round2 = 'round2',
  Round3 = 'round3'
}

/**
 * Bracket Matchups
 * (how a player fared against other players)
 */
export type BracketMatchupStats = {
  __typename?: 'BracketMatchupStats';
  count?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['String']>;
  percentage?: Maybe<Scalars['Float']>;
};

export type BracketMatchups = {
  __typename?: 'BracketMatchups';
  all_years?: Maybe<Array<Maybe<YearBracketMatchups>>>;
  id: BracketId;
  year?: Maybe<YearBracketMatchups>;
};


export type BracketMatchupsYearArgs = {
  year: Scalars['Int'];
};

export type BracketMatchupsBucket = {
  __typename?: 'BracketMatchupsBucket';
  id?: Maybe<Scalars['String']>;
  matchups?: Maybe<Array<Maybe<BracketMatchupStats>>>;
};

export type BracketMatchupsFacet = {
  __typename?: 'BracketMatchupsFacet';
  buckets?: Maybe<Array<Maybe<BracketMatchupsBucket>>>;
  completion?: Maybe<FacetCompletion>;
  id?: Maybe<Scalars['String']>;
  type?: Maybe<Facet>;
};

export type BracketWins = {
  __typename?: 'BracketWins';
  all_years?: Maybe<Array<Maybe<YearBracketWins>>>;
  id: BracketId;
  keys?: Maybe<Array<Maybe<BracketKey>>>;
  year?: Maybe<YearBracketWins>;
};


export type BracketWinsYearArgs = {
  year: Scalars['Int'];
};

export type BracketWinsBucket = {
  __typename?: 'BracketWinsBucket';
  combined?: Maybe<BracketWinsStats>;
  id?: Maybe<Scalars['String']>;
  round1?: Maybe<BracketWinsStats>;
  round2?: Maybe<BracketWinsStats>;
  round3?: Maybe<BracketWinsStats>;
};

export type BracketWinsFacet = {
  __typename?: 'BracketWinsFacet';
  buckets?: Maybe<Array<Maybe<BracketWinsBucket>>>;
  completion?: Maybe<FacetCompletion>;
  id?: Maybe<Scalars['String']>;
  type?: Maybe<Facet>;
};

/**
 * Bracket Wins
 * (how many wins a player has accumulated)
 */
export type BracketWinsStats = {
  __typename?: 'BracketWinsStats';
  count?: Maybe<Scalars['Int']>;
  percentage?: Maybe<Scalars['Float']>;
};

/** CanIUse Info */
export type CanIUse = {
  __typename?: 'CanIUse';
  name?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

/** Category */
export type Category = {
  __typename?: 'Category';
  happiness?: Maybe<CategoryHappiness>;
  tools_others?: Maybe<CategoryOtherTools>;
};


/** Category */
export type CategoryHappinessArgs = {
  filters?: InputMaybe<Filters>;
};


/** Category */
export type CategoryTools_OthersArgs = {
  filters?: InputMaybe<Filters>;
};

/** Happiness */
export type CategoryHappiness = {
  __typename?: 'CategoryHappiness';
  all_years?: Maybe<Array<Maybe<YearHappiness>>>;
  id: CategoryId;
  year?: Maybe<YearHappiness>;
};


/** Happiness */
export type CategoryHappinessYearArgs = {
  year: Scalars['Int'];
};

export enum CategoryId {
  BackEndFrameworks = 'back_end_frameworks',
  CssFrameworks = 'css_frameworks',
  CssInJs = 'css_in_js',
  CssMethodologies = 'css_methodologies',
  DataLayer = 'data_layer',
  FrontEndFrameworks = 'front_end_frameworks',
  JavascriptFlavors = 'javascript_flavors',
  MobileDesktop = 'mobile_desktop',
  PrePostProcessors = 'pre_post_processors',
  Testing = 'testing'
}

/** Other Tools */
export type CategoryOtherTools = {
  __typename?: 'CategoryOtherTools';
  all_years?: Maybe<Array<Maybe<YearOtherTools>>>;
  id: CategoryId;
  year?: Maybe<YearOtherTools>;
};


/** Other Tools */
export type CategoryOtherToolsYearArgs = {
  year: Scalars['Int'];
};

export type CompanySize = {
  __typename?: 'CompanySize';
  all_years?: Maybe<Array<Maybe<DemographicsItemYear>>>;
  keys?: Maybe<Array<Maybe<CompanySizeRange>>>;
  year?: Maybe<DemographicsItemYear>;
};


export type CompanySizeYearArgs = {
  year: Scalars['Int'];
};

export type CompanySizeFilter = {
  eq?: InputMaybe<CompanySizeRange>;
  in?: InputMaybe<Array<InputMaybe<CompanySizeRange>>>;
  nin?: InputMaybe<Array<InputMaybe<CompanySizeRange>>>;
};

export enum CompanySizeRange {
  Range_1 = 'range_1',
  Range_1_5 = 'range_1_5',
  Range_5_10 = 'range_5_10',
  Range_10_20 = 'range_10_20',
  Range_20_50 = 'range_20_50',
  Range_50_100 = 'range_50_100',
  Range_100_1000 = 'range_100_1000',
  RangeMoreThan_1000 = 'range_more_than_1000'
}

export enum Contexts {
  Accounts = 'accounts',
  Common = 'common',
  Entities = 'entities',
  Features = 'features',
  Homepage = 'homepage',
  HowToHelp = 'how_to_help',
  Projects = 'projects',
  Results = 'results',
  StateOfCss = 'state_of_css',
  StateOfCss_2020 = 'state_of_css_2020',
  StateOfCss_2020Survey = 'state_of_css_2020_survey',
  StateOfCss_2021 = 'state_of_css_2021',
  StateOfCss_2021Results = 'state_of_css_2021_results',
  StateOfCss_2021Survey = 'state_of_css_2021_survey',
  StateOfGraphql = 'state_of_graphql',
  StateOfJs = 'state_of_js',
  StateOfJs_2020 = 'state_of_js_2020',
  StateOfJs_2020Survey = 'state_of_js_2020_survey',
  StateOfJs_2021 = 'state_of_js_2021',
  StateOfJs_2021Results = 'state_of_js_2021_results',
  StateOfJs_2021Survey = 'state_of_js_2021_survey',
  Surveys = 'surveys'
}

export type Country = {
  __typename?: 'Country';
  all_years?: Maybe<Array<Maybe<DemographicsItemYear>>>;
  keys?: Maybe<Array<Maybe<CountryId>>>;
  year?: Maybe<DemographicsItemYear>;
};


export type CountryYearArgs = {
  year: Scalars['Int'];
};

export type CountryFilter = {
  eq?: InputMaybe<CountryId>;
  in?: InputMaybe<Array<InputMaybe<CountryId>>>;
  nin?: InputMaybe<Array<InputMaybe<CountryId>>>;
};

export enum CountryId {
  Abw = 'ABW',
  Afg = 'AFG',
  Ago = 'AGO',
  Aia = 'AIA',
  Ala = 'ALA',
  Alb = 'ALB',
  And = 'AND',
  Are = 'ARE',
  Arg = 'ARG',
  Arm = 'ARM',
  Asm = 'ASM',
  Ata = 'ATA',
  Atf = 'ATF',
  Atg = 'ATG',
  Aus = 'AUS',
  Aut = 'AUT',
  Aze = 'AZE',
  Bdi = 'BDI',
  Bel = 'BEL',
  Ben = 'BEN',
  Bes = 'BES',
  Bfa = 'BFA',
  Bgd = 'BGD',
  Bgr = 'BGR',
  Bhr = 'BHR',
  Bhs = 'BHS',
  Bih = 'BIH',
  Blm = 'BLM',
  Blr = 'BLR',
  Blz = 'BLZ',
  Bmu = 'BMU',
  Bol = 'BOL',
  Bra = 'BRA',
  Brb = 'BRB',
  Brn = 'BRN',
  Btn = 'BTN',
  Bvt = 'BVT',
  Bwa = 'BWA',
  Caf = 'CAF',
  Can = 'CAN',
  Cck = 'CCK',
  Che = 'CHE',
  Chl = 'CHL',
  Chn = 'CHN',
  Civ = 'CIV',
  Cmr = 'CMR',
  Cod = 'COD',
  Cog = 'COG',
  Cok = 'COK',
  Col = 'COL',
  Com = 'COM',
  Cpv = 'CPV',
  Cri = 'CRI',
  Cub = 'CUB',
  Cuw = 'CUW',
  Cxr = 'CXR',
  Cym = 'CYM',
  Cyp = 'CYP',
  Cze = 'CZE',
  Deu = 'DEU',
  Dji = 'DJI',
  Dma = 'DMA',
  Dnk = 'DNK',
  Dom = 'DOM',
  Dza = 'DZA',
  Ecu = 'ECU',
  Egy = 'EGY',
  Eri = 'ERI',
  Esh = 'ESH',
  Esp = 'ESP',
  Est = 'EST',
  Eth = 'ETH',
  Fin = 'FIN',
  Fji = 'FJI',
  Flk = 'FLK',
  Fra = 'FRA',
  Fro = 'FRO',
  Fsm = 'FSM',
  Gab = 'GAB',
  Gbr = 'GBR',
  Geo = 'GEO',
  Ggy = 'GGY',
  Gha = 'GHA',
  Gib = 'GIB',
  Gin = 'GIN',
  Glp = 'GLP',
  Gmb = 'GMB',
  Gnb = 'GNB',
  Gnq = 'GNQ',
  Grc = 'GRC',
  Grd = 'GRD',
  Grl = 'GRL',
  Gtm = 'GTM',
  Guf = 'GUF',
  Gum = 'GUM',
  Guy = 'GUY',
  Hkg = 'HKG',
  Hmd = 'HMD',
  Hnd = 'HND',
  Hrv = 'HRV',
  Hti = 'HTI',
  Hun = 'HUN',
  Idn = 'IDN',
  Imn = 'IMN',
  Ind = 'IND',
  Iot = 'IOT',
  Irl = 'IRL',
  Irn = 'IRN',
  Irq = 'IRQ',
  Isl = 'ISL',
  Isr = 'ISR',
  Ita = 'ITA',
  Jam = 'JAM',
  Jey = 'JEY',
  Jor = 'JOR',
  Jpn = 'JPN',
  Kaz = 'KAZ',
  Ken = 'KEN',
  Kgz = 'KGZ',
  Khm = 'KHM',
  Kir = 'KIR',
  Kna = 'KNA',
  Kor = 'KOR',
  Kwt = 'KWT',
  Lao = 'LAO',
  Lbn = 'LBN',
  Lbr = 'LBR',
  Lby = 'LBY',
  Lca = 'LCA',
  Lie = 'LIE',
  Lka = 'LKA',
  Lso = 'LSO',
  Ltu = 'LTU',
  Lux = 'LUX',
  Lva = 'LVA',
  Mac = 'MAC',
  Maf = 'MAF',
  Mar = 'MAR',
  Mco = 'MCO',
  Mda = 'MDA',
  Mdg = 'MDG',
  Mdv = 'MDV',
  Mex = 'MEX',
  Mhl = 'MHL',
  Mkd = 'MKD',
  Mli = 'MLI',
  Mlt = 'MLT',
  Mmr = 'MMR',
  Mne = 'MNE',
  Mng = 'MNG',
  Mnp = 'MNP',
  Moz = 'MOZ',
  Mrt = 'MRT',
  Msr = 'MSR',
  Mtq = 'MTQ',
  Mus = 'MUS',
  Mwi = 'MWI',
  Mys = 'MYS',
  Myt = 'MYT',
  Nam = 'NAM',
  Ncl = 'NCL',
  Ner = 'NER',
  Nfk = 'NFK',
  Nga = 'NGA',
  Nic = 'NIC',
  Niu = 'NIU',
  Nld = 'NLD',
  Nor = 'NOR',
  Npl = 'NPL',
  Nru = 'NRU',
  Nzl = 'NZL',
  Omn = 'OMN',
  Pak = 'PAK',
  Pan = 'PAN',
  Pcn = 'PCN',
  Per = 'PER',
  Phl = 'PHL',
  Plw = 'PLW',
  Png = 'PNG',
  Pol = 'POL',
  Pri = 'PRI',
  Prk = 'PRK',
  Prt = 'PRT',
  Pry = 'PRY',
  Pse = 'PSE',
  Pyf = 'PYF',
  Qat = 'QAT',
  Reu = 'REU',
  Rou = 'ROU',
  Rus = 'RUS',
  Rwa = 'RWA',
  Sau = 'SAU',
  Sdn = 'SDN',
  Sen = 'SEN',
  Sgp = 'SGP',
  Sgs = 'SGS',
  Shn = 'SHN',
  Sjm = 'SJM',
  Slb = 'SLB',
  Sle = 'SLE',
  Slv = 'SLV',
  Smr = 'SMR',
  Som = 'SOM',
  Spm = 'SPM',
  Srb = 'SRB',
  Ssd = 'SSD',
  Stp = 'STP',
  Sur = 'SUR',
  Svk = 'SVK',
  Svn = 'SVN',
  Swe = 'SWE',
  Swz = 'SWZ',
  Sxm = 'SXM',
  Syc = 'SYC',
  Syr = 'SYR',
  Tca = 'TCA',
  Tcd = 'TCD',
  Tgo = 'TGO',
  Tha = 'THA',
  Tjk = 'TJK',
  Tkl = 'TKL',
  Tkm = 'TKM',
  Tls = 'TLS',
  Ton = 'TON',
  Tto = 'TTO',
  Tun = 'TUN',
  Tur = 'TUR',
  Tuv = 'TUV',
  Twn = 'TWN',
  Tza = 'TZA',
  Uga = 'UGA',
  Ukr = 'UKR',
  Umi = 'UMI',
  Ury = 'URY',
  Usa = 'USA',
  Uzb = 'UZB',
  Vat = 'VAT',
  Vct = 'VCT',
  Ven = 'VEN',
  Vgb = 'VGB',
  Vir = 'VIR',
  Vnm = 'VNM',
  Vut = 'VUT',
  Wlf = 'WLF',
  Wsm = 'WSM',
  Yem = 'YEM',
  Zaf = 'ZAF',
  Zmb = 'ZMB',
  Zwe = 'ZWE'
}

/**
 * Information about particpants:
 * - overall participation
 * - gender
 * - salary
 * - company size
 * - …
 */
export type Demographics = {
  __typename?: 'Demographics';
  /** Age */
  age?: Maybe<Age>;
  /** Company size */
  company_size?: Maybe<CompanySize>;
  /** Country */
  country?: Maybe<Country>;
  /** Disability Status */
  disability_status?: Maybe<DisabilityStatus>;
  /** Disability Status (Other) */
  disability_status_others?: Maybe<OtherDisabilityStatus>;
  /** Gender */
  gender?: Maybe<Gender>;
  /** Higher Education Degree */
  higher_education_degree?: Maybe<HigherEducationDegree>;
  /** Industry Sector */
  industry_sector?: Maybe<IndustrySector>;
  /** Job title */
  job_title?: Maybe<JobTitle>;
  /** Knowledge Score */
  knowledge_score?: Maybe<KnowledgeScore>;
  /** Locale */
  locale?: Maybe<LocaleStats>;
  /** Participants count */
  participation?: Maybe<Participation>;
  /** Race & Ethnicity */
  race_ethnicity?: Maybe<RaceEthnicity>;
  /** How respondents found the survey */
  source?: Maybe<Source>;
  /** Salary */
  yearly_salary?: Maybe<Salary>;
  /** Work experience as a developer */
  years_of_experience?: Maybe<WorkExperience>;
};


/**
 * Information about particpants:
 * - overall participation
 * - gender
 * - salary
 * - company size
 * - …
 */
export type DemographicsAgeArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  options?: InputMaybe<Options>;
};


/**
 * Information about particpants:
 * - overall participation
 * - gender
 * - salary
 * - company size
 * - …
 */
export type DemographicsCompany_SizeArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  options?: InputMaybe<Options>;
};


/**
 * Information about particpants:
 * - overall participation
 * - gender
 * - salary
 * - company size
 * - …
 */
export type DemographicsCountryArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  options?: InputMaybe<Options>;
};


/**
 * Information about particpants:
 * - overall participation
 * - gender
 * - salary
 * - company size
 * - …
 */
export type DemographicsDisability_StatusArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  options?: InputMaybe<Options>;
};


/**
 * Information about particpants:
 * - overall participation
 * - gender
 * - salary
 * - company size
 * - …
 */
export type DemographicsDisability_Status_OthersArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  options?: InputMaybe<Options>;
};


/**
 * Information about particpants:
 * - overall participation
 * - gender
 * - salary
 * - company size
 * - …
 */
export type DemographicsGenderArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  options?: InputMaybe<Options>;
};


/**
 * Information about particpants:
 * - overall participation
 * - gender
 * - salary
 * - company size
 * - …
 */
export type DemographicsHigher_Education_DegreeArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  options?: InputMaybe<Options>;
};


/**
 * Information about particpants:
 * - overall participation
 * - gender
 * - salary
 * - company size
 * - …
 */
export type DemographicsIndustry_SectorArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  options?: InputMaybe<Options>;
};


/**
 * Information about particpants:
 * - overall participation
 * - gender
 * - salary
 * - company size
 * - …
 */
export type DemographicsJob_TitleArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  options?: InputMaybe<Options>;
};


/**
 * Information about particpants:
 * - overall participation
 * - gender
 * - salary
 * - company size
 * - …
 */
export type DemographicsKnowledge_ScoreArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  options?: InputMaybe<Options>;
};


/**
 * Information about particpants:
 * - overall participation
 * - gender
 * - salary
 * - company size
 * - …
 */
export type DemographicsLocaleArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  options?: InputMaybe<Options>;
};


/**
 * Information about particpants:
 * - overall participation
 * - gender
 * - salary
 * - company size
 * - …
 */
export type DemographicsParticipationArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  options?: InputMaybe<Options>;
};


/**
 * Information about particpants:
 * - overall participation
 * - gender
 * - salary
 * - company size
 * - …
 */
export type DemographicsRace_EthnicityArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  options?: InputMaybe<Options>;
};


/**
 * Information about particpants:
 * - overall participation
 * - gender
 * - salary
 * - company size
 * - …
 */
export type DemographicsSourceArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  options?: InputMaybe<Options>;
};


/**
 * Information about particpants:
 * - overall participation
 * - gender
 * - salary
 * - company size
 * - …
 */
export type DemographicsYearly_SalaryArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  options?: InputMaybe<Options>;
};


/**
 * Information about particpants:
 * - overall participation
 * - gender
 * - salary
 * - company size
 * - …
 */
export type DemographicsYears_Of_ExperienceArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  options?: InputMaybe<Options>;
};

export type DemographicsItem = {
  __typename?: 'DemographicsItem';
  all_years?: Maybe<Array<Maybe<DemographicsItemYear>>>;
  year?: Maybe<DemographicsItemYear>;
};


export type DemographicsItemYearArgs = {
  year: Scalars['Int'];
};

/** Generic Types */
export type DemographicsItemYear = {
  __typename?: 'DemographicsItemYear';
  completion?: Maybe<YearCompletion>;
  facets?: Maybe<Array<Maybe<EntityFacet>>>;
  year?: Maybe<Scalars['Int']>;
};

export type DisabilityStatus = {
  __typename?: 'DisabilityStatus';
  all_years?: Maybe<Array<Maybe<DemographicsItemYear>>>;
  keys?: Maybe<Array<Maybe<DisabilityStatusId>>>;
  year?: Maybe<DemographicsItemYear>;
};


export type DisabilityStatusYearArgs = {
  year: Scalars['Int'];
};

export enum DisabilityStatusId {
  CognitiveImpairments = 'cognitive_impairments',
  HearingImpairments = 'hearing_impairments',
  MobilityImpairments = 'mobility_impairments',
  NotListed = 'not_listed',
  VisualImpairments = 'visual_impairments'
}

export type EmailOctopusConfig = {
  __typename?: 'EmailOctopusConfig';
  listId?: Maybe<Scalars['String']>;
};

/**
 * An entity is any object that can have associated metadata
 * (such as a homepage, github repo, description).
 * For example: a library, a podcast, a blog, a framework…
 */
export type Entity = {
  __typename?: 'Entity';
  blog?: Maybe<Scalars['String']>;
  caniuse?: Maybe<CanIUse>;
  category?: Maybe<Scalars['String']>;
  company?: Maybe<Entity>;
  companyName?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  github?: Maybe<GitHub>;
  homepage?: Maybe<Homepage>;
  id?: Maybe<Scalars['String']>;
  mdn?: Maybe<Mdn>;
  name?: Maybe<Scalars['String']>;
  npm?: Maybe<Npm>;
  otherName?: Maybe<Scalars['String']>;
  patterns?: Maybe<Array<Maybe<Scalars['String']>>>;
  related?: Maybe<Array<Maybe<Entity>>>;
  rss?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  twitter?: Maybe<Twitter>;
  twitterName?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  youtubeName?: Maybe<Scalars['String']>;
};

/** A datapoint associated with a given entity. */
export type EntityBucket = {
  __typename?: 'EntityBucket';
  /** Respondent count */
  count?: Maybe<Scalars['Int']>;
  /** Count of respondents in all facets (same as default/null facet) */
  count_all_facets?: Maybe<Scalars['Int']>;
  entity?: Maybe<Entity>;
  id?: Maybe<Scalars['String']>;
  /** Percentage relative to question respondents in all facets (same as default/null faces) */
  percentage_all_facets?: Maybe<Scalars['Float']>;
  /** Percentage relative to question respondents in facet */
  percentage_facet?: Maybe<Scalars['Float']>;
  /** Percentage relative to question respondents */
  percentage_question?: Maybe<Scalars['Float']>;
  /** Percentage relative to survey respondents */
  percentage_survey?: Maybe<Scalars['Float']>;
};

/** A facet associated with a set of entities. */
export type EntityFacet = {
  __typename?: 'EntityFacet';
  buckets?: Maybe<Array<Maybe<EntityBucket>>>;
  completion?: Maybe<FacetCompletion>;
  entity?: Maybe<Entity>;
  id?: Maybe<Scalars['String']>;
  mean?: Maybe<Scalars['Float']>;
  type?: Maybe<Facet>;
};

export enum EnvironmentId {
  AccessibilityFeatures = 'accessibility_features',
  AccessibilityFeaturesOthers = 'accessibility_features_others',
  Browsers = 'browsers',
  BrowsersOthers = 'browsers_others',
  CssForEmail = 'css_for_email',
  CssForPrint = 'css_for_print',
  FormFactors = 'form_factors',
  FormFactorsOthers = 'form_factors_others',
  WhatDoYouUseCssFor = 'what_do_you_use_css_for',
  WhatDoYouUseCssForOthers = 'what_do_you_use_css_for_others'
}

export type EnvironmentRatingBucket = {
  __typename?: 'EnvironmentRatingBucket';
  count?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  percentage_facet?: Maybe<Scalars['Float']>;
  percentage_question?: Maybe<Scalars['Float']>;
  percentage_survey?: Maybe<Scalars['Float']>;
};

/** An environment, based on multiple choices (e.g. browsers, form factors, etc.) */
export type Environments = {
  __typename?: 'Environments';
  all_years?: Maybe<Array<Maybe<YearEnvironments>>>;
  id: EnvironmentId;
  year?: Maybe<YearEnvironments>;
};


/** An environment, based on multiple choices (e.g. browsers, form factors, etc.) */
export type EnvironmentsYearArgs = {
  year: Scalars['Int'];
};

/** An environment-based rating (e.g. css for emails, css for print, etc.) */
export type EnvironmentsRatings = {
  __typename?: 'EnvironmentsRatings';
  all_years?: Maybe<Array<Maybe<YearEnvironmentsRatings>>>;
  id: EnvironmentId;
  year?: Maybe<YearEnvironmentsRatings>;
};


/** An environment-based rating (e.g. css for emails, css for print, etc.) */
export type EnvironmentsRatingsYearArgs = {
  year: Scalars['Int'];
};

export enum Facet {
  CompanySize = 'company_size',
  Country = 'country',
  Default = 'default',
  Gender = 'gender',
  HigherEducationDegree = 'higher_education_degree',
  IndustrySector = 'industry_sector',
  RaceEthnicity = 'race_ethnicity',
  Source = 'source',
  YearlySalary = 'yearly_salary',
  YearsOfExperience = 'years_of_experience'
}

export type FacetCompletion = {
  __typename?: 'FacetCompletion';
  /** Number of respondents in this facet */
  count?: Maybe<Scalars['Int']>;
  /** Completion percentage relative to total number of question respondents */
  percentage_question?: Maybe<Scalars['Float']>;
  /** Completion percentage relative to total number of survey respondents for a given year */
  percentage_survey?: Maybe<Scalars['Float']>;
  /** Total number of respondents who have answered the survey for a specific year */
  total?: Maybe<Scalars['Int']>;
};

/** A feature (e.g. arrow functions, websocket, etc.) */
export type Feature = {
  __typename?: 'Feature';
  entity?: Maybe<Entity>;
  experience?: Maybe<FeatureExperience>;
  id: FeatureId;
  mdn?: Maybe<Mdn>;
  name?: Maybe<Scalars['String']>;
};


/** A feature (e.g. arrow functions, websocket, etc.) */
export type FeatureExperienceArgs = {
  filters?: InputMaybe<Filters>;
};

export type FeatureBucket = {
  __typename?: 'FeatureBucket';
  count?: Maybe<Scalars['Int']>;
  id?: Maybe<FeatureId>;
  name?: Maybe<Scalars['String']>;
  percentage_facet?: Maybe<Scalars['Float']>;
  percentage_question?: Maybe<Scalars['Float']>;
  percentage_survey?: Maybe<Scalars['Float']>;
};

export type FeatureExperience = {
  __typename?: 'FeatureExperience';
  all_years?: Maybe<Array<Maybe<YearFeature>>>;
  keys?: Maybe<Array<Maybe<FeatureExperienceId>>>;
  year?: Maybe<YearFeature>;
};


export type FeatureExperienceYearArgs = {
  year: Scalars['Int'];
};

/** A feature experience datapoint */
export type FeatureExperienceBucket = {
  __typename?: 'FeatureExperienceBucket';
  count?: Maybe<Scalars['Int']>;
  countDelta?: Maybe<Scalars['Int']>;
  id?: Maybe<FeatureExperienceId>;
  percentageDelta?: Maybe<Scalars['Float']>;
  percentage_facet?: Maybe<Scalars['Float']>;
  percentage_question?: Maybe<Scalars['Float']>;
  percentage_survey?: Maybe<Scalars['Float']>;
};

export enum FeatureExperienceId {
  Heard = 'heard',
  NeverHeard = 'never_heard',
  Used = 'used'
}

/** Feature data for a specific facet */
export type FeatureFacet = {
  __typename?: 'FeatureFacet';
  buckets?: Maybe<Array<Maybe<FeatureExperienceBucket>>>;
  completion?: Maybe<FacetCompletion>;
  id?: Maybe<Scalars['String']>;
  type?: Maybe<Facet>;
};

export enum FeatureId {
  AccentColor = 'accent_color',
  Active = 'active',
  After = 'after',
  Animations = 'animations',
  AnyLink = 'any_link',
  AriaAttributes = 'aria_attributes',
  ArrayAt = 'array_at',
  ArrayPrototypeFlat = 'array_prototype_flat',
  ArrowFunctions = 'arrow_functions',
  AspectRatio = 'aspect_ratio',
  AsyncAwait = 'async_await',
  AtContainer = 'at_container',
  AtProperty = 'at_property',
  Backdrop = 'backdrop',
  BackdropFilter = 'backdrop_filter',
  Before = 'before',
  BigInt = 'big_int',
  BlendModes = 'blend_modes',
  BreakRules = 'break_rules',
  BroadcastChannel = 'broadcast_channel',
  Calc = 'calc',
  Ch = 'ch',
  Checked = 'checked',
  Child = 'child',
  ClipPath = 'clip_path',
  Cm = 'cm',
  ColorContrast = 'color_contrast',
  ColorFunction = 'color_function',
  ColorGamut = 'color_gamut',
  ColorScheme = 'color_scheme',
  ComparisonFunctions = 'comparison_functions',
  ConicGradient = 'conic_gradient',
  Containment = 'containment',
  ContainsSubstring = 'contains_substring',
  ContainsWord = 'contains_word',
  ContentVisibility = 'content_visibility',
  CustomElements = 'custom_elements',
  Decorators = 'decorators',
  Default = 'default',
  Descendant = 'descendant',
  Destructuring = 'destructuring',
  Direction = 'direction',
  DynamicImport = 'dynamic_import',
  Em = 'em',
  Empty = 'empty',
  EnabledDisabled = 'enabled_disabled',
  EndsWith = 'ends_with',
  Equality = 'equality',
  Ex = 'ex',
  Exclusions = 'exclusions',
  FeatureSupportQueries = 'feature_support_queries',
  Fetch = 'fetch',
  FileSystemAccess = 'file_system_access',
  FilterEffects = 'filter_effects',
  FirstChild = 'first_child',
  FirstLetter = 'first_letter',
  FirstLine = 'first_line',
  FirstOfType = 'first_of_type',
  Flexbox = 'flexbox',
  FlexboxGap = 'flexbox_gap',
  Focus = 'focus',
  FocusVisible = 'focus_visible',
  FocusWithin = 'focus_within',
  FontDisplay = 'font_display',
  FontVariant = 'font_variant',
  FontVariantNumeric = 'font_variant_numeric',
  Geolocation = 'geolocation',
  Grid = 'grid',
  Houdini = 'houdini',
  Hover = 'hover',
  I18n = 'i18n',
  In = 'in',
  InOutRange = 'in_out_range',
  Indeterminate = 'indeterminate',
  InitialLetter = 'initial_letter',
  Intl = 'intl',
  IntrinsicSizing = 'intrinsic_sizing',
  Is = 'is',
  Lang = 'lang',
  LastChild = 'last_child',
  LastOfType = 'last_of_type',
  LeadingTrim = 'leading_trim',
  LineBreaking = 'line_breaking',
  LineClamp = 'line_clamp',
  LinkVisited = 'link_visited',
  LocalLink = 'local_link',
  LocalStorage = 'local_storage',
  LogicalAssignment = 'logical_assignment',
  LogicalProperties = 'logical_properties',
  Maps = 'maps',
  Marker = 'marker',
  Masks = 'masks',
  Mm = 'mm',
  MultiColumn = 'multi_column',
  NextSibling = 'next_sibling',
  Not = 'not',
  NthChild = 'nth_child',
  NthLastChild = 'nth_last_child',
  NthLastOfType = 'nth_last_of_type',
  NthOfType = 'nth_of_type',
  NullishCoalescing = 'nullish_coalescing',
  NumericSeparators = 'numeric_separators',
  ObjectFit = 'object_fit',
  OnlyChild = 'only_child',
  OnlyOfType = 'only_of_type',
  OptionalChaining = 'optional_chaining',
  OverflowAnchor = 'overflow_anchor',
  OverscrollBehavior = 'overscroll_behavior',
  PageVisibility = 'page_visibility',
  Percent = 'percent',
  Perspective = 'perspective',
  Placeholder = 'placeholder',
  PlaceholderShown = 'placeholder_shown',
  PointerEvents = 'pointer_events',
  PositionSticky = 'position_sticky',
  PrefersColorScheme = 'prefers_color_scheme',
  PrefersReducedData = 'prefers_reduced_data',
  PrefersReducedMotion = 'prefers_reduced_motion',
  Presence = 'presence',
  PrivateFields = 'private_fields',
  PromiseAllSettled = 'promise_all_settled',
  PromiseAny = 'promise_any',
  Promises = 'promises',
  Proxies = 'proxies',
  Pt = 'pt',
  Pwa = 'pwa',
  Px = 'px',
  ReadOnlyWrite = 'read_only_write',
  Regions = 'regions',
  Rem = 'rem',
  RequiredOptional = 'required_optional',
  Root = 'root',
  ScrollSnap = 'scroll_snap',
  ScrollTimeline = 'scroll_timeline',
  Selection = 'selection',
  ServiceWorkers = 'service_workers',
  Sets = 'sets',
  ShadowDom = 'shadow_dom',
  Shapes = 'shapes',
  SpreadOperator = 'spread_operator',
  StartsWith = 'starts_with',
  StringMatchAll = 'string_match_all',
  StringReplaceAll = 'string_replace_all',
  Subgrid = 'subgrid',
  SubsequentSibling = 'subsequent_sibling',
  Tabindex = 'tabindex',
  Target = 'target',
  TopLevelAwait = 'top_level_await',
  TouchAction = 'touch_action',
  Transforms = 'transforms',
  Transitions = 'transitions',
  TypedArrays = 'typed_arrays',
  UserInvalid = 'user_invalid',
  ValidInvalid = 'valid_invalid',
  VariableFonts = 'variable_fonts',
  Variables = 'variables',
  VhVw = 'vh_vw',
  VminVmax = 'vmin_vmax',
  Wasm = 'wasm',
  WebAnimations = 'web_animations',
  WebAudio = 'web_audio',
  WebComponents = 'web_components',
  WebFonts = 'web_fonts',
  WebShare = 'web_share',
  WebSpeech = 'web_speech',
  Webgl = 'webgl',
  Webrtc = 'webrtc',
  Websocket = 'websocket',
  Webvr = 'webvr',
  Webxr = 'webxr',
  Where = 'where',
  WillChange = 'will_change',
  WritingModes = 'writing_modes'
}

export type Filters = {
  company_size?: InputMaybe<CompanySizeFilter>;
  country?: InputMaybe<CountryFilter>;
  gender?: InputMaybe<GenderFilter>;
  industry_sector?: InputMaybe<IndustrySectorFilter>;
  race_ethnicity?: InputMaybe<RaceEthnicityFilter>;
  source?: InputMaybe<SourceFilter>;
  yearly_salary?: InputMaybe<YearlySalaryRangeFilter>;
  years_of_experience?: InputMaybe<YearsOfExperienceFilter>;
};

export type Gender = {
  __typename?: 'Gender';
  all_years?: Maybe<Array<Maybe<DemographicsItemYear>>>;
  keys?: Maybe<Array<Maybe<GenderId>>>;
  year?: Maybe<DemographicsItemYear>;
};


export type GenderYearArgs = {
  year: Scalars['Int'];
};

export type GenderFilter = {
  eq?: InputMaybe<GenderId>;
  in?: InputMaybe<Array<InputMaybe<GenderId>>>;
  nin?: InputMaybe<Array<InputMaybe<GenderId>>>;
};

export enum GenderId {
  Female = 'female',
  Male = 'male',
  NonBinary = 'non_binary',
  NotListed = 'not_listed',
  PreferNotToSay = 'prefer_not_to_say'
}

export type GitHub = {
  __typename?: 'GitHub';
  description?: Maybe<Scalars['String']>;
  forks?: Maybe<Scalars['Int']>;
  full_name?: Maybe<Scalars['String']>;
  homepage?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  opened_issues?: Maybe<Scalars['Int']>;
  stars?: Maybe<Scalars['Int']>;
  url?: Maybe<Scalars['String']>;
};

export type Happiness = {
  __typename?: 'Happiness';
  all_years?: Maybe<Array<Maybe<YearHappiness>>>;
  id: HappinessId;
  keys?: Maybe<Array<Maybe<Scalars['Int']>>>;
  year?: Maybe<YearHappiness>;
};


export type HappinessYearArgs = {
  year: Scalars['Int'];
};

/** Happiness */
export type HappinessBucket = {
  __typename?: 'HappinessBucket';
  count?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  percentage_facet?: Maybe<Scalars['Float']>;
  percentage_question?: Maybe<Scalars['Float']>;
  percentage_survey?: Maybe<Scalars['Float']>;
};

export type HappinessFacet = {
  __typename?: 'HappinessFacet';
  buckets?: Maybe<Array<Maybe<HappinessBucket>>>;
  completion?: Maybe<FacetCompletion>;
  id?: Maybe<Scalars['String']>;
  type?: Maybe<Facet>;
};

export enum HappinessId {
  BackEndFrameworks = 'back_end_frameworks',
  BuildTools = 'build_tools',
  CssFrameworks = 'css_frameworks',
  CssInJs = 'css_in_js',
  CssMethodologies = 'css_methodologies',
  Datalayer = 'datalayer',
  FrontEndFrameworks = 'front_end_frameworks',
  JavascriptFlavors = 'javascript_flavors',
  MobileDesktop = 'mobile_desktop',
  MonorepoTools = 'monorepo_tools',
  PrePostProcessors = 'pre_post_processors',
  StateOfCss = 'state_of_css',
  StateOfGraphql = 'state_of_graphql',
  StateOfJs = 'state_of_js',
  StateOfTheWeb = 'state_of_the_web',
  Testing = 'testing'
}

export type HigherEducationDegree = {
  __typename?: 'HigherEducationDegree';
  all_years?: Maybe<Array<Maybe<DemographicsItemYear>>>;
  keys?: Maybe<Array<Maybe<HigherEducationDegreeId>>>;
  year?: Maybe<DemographicsItemYear>;
};


export type HigherEducationDegreeYearArgs = {
  year: Scalars['Int'];
};

export enum HigherEducationDegreeId {
  NoDegree = 'no_degree',
  YesRelated = 'yes_related',
  YesUnrelated = 'yes_unrelated'
}

/** Homepage Info */
export type Homepage = {
  __typename?: 'Homepage';
  name?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type IndustrySector = {
  __typename?: 'IndustrySector';
  all_years?: Maybe<Array<Maybe<DemographicsItemYear>>>;
  keys?: Maybe<Array<Maybe<IndustrySectorId>>>;
  year?: Maybe<DemographicsItemYear>;
};


export type IndustrySectorYearArgs = {
  year: Scalars['Int'];
};

export type IndustrySectorFilter = {
  eq?: InputMaybe<IndustrySectorId>;
};

export enum IndustrySectorId {
  Consulting = 'consulting',
  Ecommerce = 'ecommerce',
  Education = 'education',
  Entertainment = 'entertainment',
  Finance = 'finance',
  Government = 'government',
  Healthcare = 'healthcare',
  MarketingTools = 'marketing_tools',
  NewsMedia = 'news_media',
  ProgrammingTools = 'programming_tools',
  RealEstate = 'real_estate',
  Socialmedia = 'socialmedia'
}

export type JobTitle = {
  __typename?: 'JobTitle';
  all_years?: Maybe<Array<Maybe<DemographicsItemYear>>>;
  keys?: Maybe<Array<Maybe<JobTitleId>>>;
  year?: Maybe<DemographicsItemYear>;
};


export type JobTitleYearArgs = {
  year: Scalars['Int'];
};

export enum JobTitleId {
  BackEndDeveloper = 'back_end_developer',
  Cto = 'cto',
  FrontEndDeveloper = 'front_end_developer',
  FullStackDeveloper = 'full_stack_developer',
  UiDesigner = 'ui_designer',
  UxDesigner = 'ux_designer',
  WebDesigner = 'web_designer',
  WebDeveloper = 'web_developer'
}

export type KnowledgeScore = {
  __typename?: 'KnowledgeScore';
  all_years?: Maybe<Array<Maybe<DemographicsItemYear>>>;
  keys?: Maybe<Array<Maybe<Scalars['String']>>>;
  year?: Maybe<DemographicsItemYear>;
};


export type KnowledgeScoreYearArgs = {
  year: Scalars['Int'];
};

export type Locale = {
  __typename?: 'Locale';
  completion?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  repo?: Maybe<Scalars['String']>;
  strings?: Maybe<Array<Maybe<TranslationString>>>;
  totalCount?: Maybe<Scalars['Int']>;
  translatedCount?: Maybe<Scalars['Int']>;
  translators?: Maybe<Array<Maybe<Scalars['String']>>>;
  untranslatedKeys?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type LocaleStats = {
  __typename?: 'LocaleStats';
  all_years?: Maybe<Array<Maybe<DemographicsItemYear>>>;
  keys?: Maybe<Array<Maybe<Scalars['String']>>>;
  year?: Maybe<DemographicsItemYear>;
};


export type LocaleStatsYearArgs = {
  year: Scalars['Int'];
};

export type Mdn = {
  __typename?: 'MDN';
  locale?: Maybe<Scalars['String']>;
  summary?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type Matrices = {
  __typename?: 'Matrices';
  tools?: Maybe<Array<Maybe<ToolsExperienceMatrices>>>;
};


export type MatricesToolsArgs = {
  dimensions: Array<InputMaybe<MatrixDimensionId>>;
  experiences: Array<InputMaybe<ToolMatrixExperienceId>>;
  ids: Array<InputMaybe<ToolId>>;
  year: Scalars['Int'];
};

export type MatrixBucket = {
  __typename?: 'MatrixBucket';
  /**
   * Number of responses for a given tool/feature in a specific range.
   * e.g. users who picked `range_50_100` for `company_size` and also
   * picked `would_use` for experience with `tailwind_css`.
   */
  count?: Maybe<Scalars['Int']>;
  /**
   * Id of the bucket dimension range, e.g. `range_50_100`
   * for `company_size`.
   */
  id?: Maybe<Scalars['String']>;
  /**
   * Ratio from all respondents who picked a specific experience
   * for the current tool and also answered to the question related
   * to the dimension, e.g. `yearly_salary`.
   * `count` VS `total`.
   */
  percentage?: Maybe<Scalars['Float']>;
  /**
   * Ratio of experience in this specific range,
   * `count` VS `range_total`.
   */
  range_percentage?: Maybe<Scalars['Float']>;
  /**
   * Delta between the overall percentage of responses
   * for the selected experience filter compared
   * to the percentage in this range.
   * `range_percentage` VS overall percentage.
   */
  range_percentage_delta?: Maybe<Scalars['Float']>;
  /**
   * Total number of respondents for this specific range,
   * e.g. number of users who selected `range_50_100`
   * for the `company_size` question and also answered
   * the experience question.
   */
  range_total?: Maybe<Scalars['Int']>;
};

export enum MatrixDimensionId {
  CompanySize = 'company_size',
  Source = 'source',
  YearlySalary = 'yearly_salary',
  YearsOfExperience = 'years_of_experience'
}

/** NPM Info */
export type Npm = {
  __typename?: 'NPM';
  name?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type Opinion = {
  __typename?: 'Opinion';
  all_years?: Maybe<Array<Maybe<YearOpinion>>>;
  id: OpinionId;
  keys?: Maybe<Array<Maybe<Scalars['Int']>>>;
  year?: Maybe<YearOpinion>;
};


export type OpinionYearArgs = {
  year: Scalars['Int'];
};

export type OpinionBucket = {
  __typename?: 'OpinionBucket';
  count?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  percentage_facet?: Maybe<Scalars['Float']>;
  percentage_question?: Maybe<Scalars['Float']>;
  percentage_survey?: Maybe<Scalars['Float']>;
};

export type OpinionFacet = {
  __typename?: 'OpinionFacet';
  buckets?: Maybe<Array<Maybe<OpinionBucket>>>;
  completion?: Maybe<FacetCompletion>;
  id?: Maybe<Scalars['String']>;
  type?: Maybe<Facet>;
};

/** Opinions */
export enum OpinionId {
  BuildingJsAppsOverlyComplex = 'building_js_apps_overly_complex',
  CssEasyToLearn = 'css_easy_to_learn',
  CssEvolvingSlowly = 'css_evolving_slowly',
  CssIsProgrammingLanguage = 'css_is_programming_language',
  EnjoyBuildingJsApps = 'enjoy_building_js_apps',
  EnjoyWritingCss = 'enjoy_writing_css',
  JsEcosystemChangingToFast = 'js_ecosystem_changing_to_fast',
  JsMovingInRightDirection = 'js_moving_in_right_direction',
  JsOverUsedOnline = 'js_over_used_online',
  SelectorNestingToBeAvoided = 'selector_nesting_to_be_avoided',
  UtilityClassesToBeAvoided = 'utility_classes_to_be_avoided',
  WouldLikeJsToBeMainLang = 'would_like_js_to_be_main_lang'
}

export type Options = {
  cutoff?: InputMaybe<Scalars['Int']>;
  facetLimit?: InputMaybe<Scalars['Int']>;
  facetMinCount?: InputMaybe<Scalars['Int']>;
  facetMinPercent?: InputMaybe<Scalars['Float']>;
  facetSort?: InputMaybe<SortSpecifier>;
  limit?: InputMaybe<Scalars['Int']>;
  sort?: InputMaybe<SortSpecifier>;
};

export type OtherDisabilityStatus = {
  __typename?: 'OtherDisabilityStatus';
  all_years?: Maybe<Array<Maybe<DemographicsItemYear>>>;
  keys?: Maybe<Array<Maybe<Scalars['String']>>>;
  year?: Maybe<DemographicsItemYear>;
};


export type OtherDisabilityStatusYearArgs = {
  year: Scalars['Int'];
};

export type OtherFeatures = {
  __typename?: 'OtherFeatures';
  all_years?: Maybe<Array<Maybe<YearOtherFeatures>>>;
  id: OtherFeaturesId;
  year?: Maybe<YearOtherFeatures>;
};


export type OtherFeaturesYearArgs = {
  year: Scalars['Int'];
};

export enum OtherFeaturesId {
  Attributes = 'attributes',
  Combinators = 'combinators',
  FormControls = 'form_controls',
  Interaction = 'interaction',
  LinksUrls = 'links_urls',
  PseudoElements = 'pseudo_elements',
  TreeDocumentStructure = 'tree_document_structure',
  Units = 'units'
}

export type OtherOpinions = {
  __typename?: 'OtherOpinions';
  all_years?: Maybe<Array<Maybe<YearOtherOpinions>>>;
  id: OtherOpinionsId;
  year?: Maybe<YearOtherOpinions>;
};


export type OtherOpinionsYearArgs = {
  year: Scalars['Int'];
};

/** Other Opinions */
export enum OtherOpinionsId {
  BrowserInteroperabilityFeatures = 'browser_interoperability_features',
  CssPainPoints = 'css_pain_points',
  CurrentlyMissingFromCss = 'currently_missing_from_css',
  CurrentlyMissingFromJs = 'currently_missing_from_js',
  JsPainPoints = 'js_pain_points',
  MissingFromJs = 'missing_from_js'
}

export type OtherTools = {
  __typename?: 'OtherTools';
  all_years?: Maybe<Array<Maybe<YearOtherTools>>>;
  id: OtherToolsId;
  year?: Maybe<YearOtherTools>;
};


export type OtherToolsYearArgs = {
  year: Scalars['Int'];
};

export enum OtherToolsId {
  BackEndFrameworksOthers = 'back_end_frameworks_others',
  Browsers = 'browsers',
  BrowsersOthers = 'browsers_others',
  BuildTools = 'build_tools',
  BuildToolsOthers = 'build_tools_others',
  CssFrameworksOthers = 'css_frameworks_others',
  CssInJsOthers = 'css_in_js_others',
  CssMethodologiesOthers = 'css_methodologies_others',
  DatalayerOthers = 'datalayer_others',
  FrontEndFrameworksOthers = 'front_end_frameworks_others',
  JavascriptFlavors = 'javascript_flavors',
  JavascriptFlavorsOthers = 'javascript_flavors_others',
  Libraries = 'libraries',
  LibrariesOthers = 'libraries_others',
  MobileDesktopOthers = 'mobile_desktop_others',
  MonorepoToolsOthers = 'monorepo_tools_others',
  NonJsLanguages = 'non_js_languages',
  NonJsLanguagesOthers = 'non_js_languages_others',
  PrePostProcessorsOthers = 'pre_post_processors_others',
  Runtimes = 'runtimes',
  RuntimesOthers = 'runtimes_others',
  TestingOthers = 'testing_others',
  TextEditors = 'text_editors',
  TextEditorsOthers = 'text_editors_others',
  Utilities = 'utilities',
  UtilitiesOthers = 'utilities_others'
}

export type Participation = {
  __typename?: 'Participation';
  all_years?: Maybe<Array<Maybe<YearParticipation>>>;
  year?: Maybe<YearParticipation>;
};


export type ParticipationYearArgs = {
  year: Scalars['Int'];
};

export type Proficiency = {
  __typename?: 'Proficiency';
  all_years?: Maybe<Array<Maybe<YearProficiency>>>;
  id: ProficiencyId;
  year?: Maybe<YearProficiency>;
};


export type ProficiencyYearArgs = {
  year: Scalars['Int'];
};

export type ProficiencyBucket = {
  __typename?: 'ProficiencyBucket';
  count?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  percentage_facet?: Maybe<Scalars['Float']>;
  percentage_question?: Maybe<Scalars['Float']>;
  percentage_survey?: Maybe<Scalars['Float']>;
};

export enum ProficiencyId {
  BackendProficiency = 'backend_proficiency',
  CssProficiency = 'css_proficiency',
  JavascriptProficiency = 'javascript_proficiency'
}

export type Query = {
  __typename?: 'Query';
  /** Get multiple entities (tools, libraries, frameworks, features, etc.) */
  entities?: Maybe<Array<Maybe<Entity>>>;
  /** Data about a specific entity (tool, library, framework, features, etc.) */
  entity?: Maybe<Entity>;
  /** Get a locale */
  locale?: Maybe<Locale>;
  /** Get multiple locales */
  locales?: Maybe<Array<Maybe<Locale>>>;
  /** Data for a specific survey. */
  survey?: Maybe<Survey>;
  /** All surveys. */
  surveys?: Maybe<Array<Maybe<SurveyItem>>>;
  /** Translate a string */
  translation?: Maybe<TranslationString>;
};


export type QueryEntitiesArgs = {
  context?: InputMaybe<Scalars['String']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tag?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  type?: InputMaybe<Scalars['String']>;
};


export type QueryEntityArgs = {
  id: Scalars['ID'];
};


export type QueryLocaleArgs = {
  contexts?: InputMaybe<Array<InputMaybe<Contexts>>>;
  enableFallbacks?: InputMaybe<Scalars['Boolean']>;
  localeId: Scalars['String'];
};


export type QueryLocalesArgs = {
  contexts?: InputMaybe<Array<InputMaybe<Contexts>>>;
  enableFallbacks?: InputMaybe<Scalars['Boolean']>;
  localeIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QuerySurveyArgs = {
  survey: SurveyType;
};


export type QueryTranslationArgs = {
  key: Scalars['String'];
  localeId: Scalars['String'];
};

export type RaceEthnicity = {
  __typename?: 'RaceEthnicity';
  all_years?: Maybe<Array<Maybe<DemographicsItemYear>>>;
  keys?: Maybe<Array<Maybe<RaceEthnicityId>>>;
  year?: Maybe<DemographicsItemYear>;
};


export type RaceEthnicityYearArgs = {
  year: Scalars['Int'];
};

export type RaceEthnicityFilter = {
  eq?: InputMaybe<RaceEthnicityId>;
};

export enum RaceEthnicityId {
  Biracial = 'biracial',
  BlackAfrican = 'black_african',
  EastAsian = 'east_asian',
  HispanicLatin = 'hispanic_latin',
  MiddleEastern = 'middle_eastern',
  Multiracial = 'multiracial',
  NativeAmericanIslanderAustralian = 'native_american_islander_australian',
  NotListed = 'not_listed',
  SouthAsian = 'south_asian',
  SouthEastAsian = 'south_east_asian',
  WhiteEuropean = 'white_european'
}

export type Resources = {
  __typename?: 'Resources';
  all_years?: Maybe<Array<Maybe<YearResources>>>;
  id: ResourcesId;
  year?: Maybe<YearResources>;
};


export type ResourcesYearArgs = {
  year: Scalars['Int'];
};

export enum ResourcesId {
  BlogsNewsMagazines = 'blogs_news_magazines',
  BlogsNewsMagazinesOthers = 'blogs_news_magazines_others',
  FirstSteps = 'first_steps',
  FirstStepsOthers = 'first_steps_others',
  PeopleOthers = 'people_others',
  Podcasts = 'podcasts',
  PodcastsOthers = 'podcasts_others',
  SitesCourses = 'sites_courses',
  SitesCoursesOthers = 'sites_courses_others'
}

export type Salary = {
  __typename?: 'Salary';
  all_years?: Maybe<Array<Maybe<DemographicsItemYear>>>;
  keys?: Maybe<Array<Maybe<SalaryRange>>>;
  year?: Maybe<DemographicsItemYear>;
};


export type SalaryYearArgs = {
  year: Scalars['Int'];
};

export enum SalaryRange {
  Range_0_10 = 'range_0_10',
  Range_10_30 = 'range_10_30',
  Range_30_50 = 'range_30_50',
  Range_50_100 = 'range_50_100',
  Range_100_200 = 'range_100_200',
  RangeMoreThan_200 = 'range_more_than_200',
  RangeWorkForFree = 'range_work_for_free'
}

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export type SortSpecifier = {
  order?: InputMaybe<SortOrder>;
  property?: InputMaybe<Scalars['String']>;
};

export type Source = {
  __typename?: 'Source';
  all_years?: Maybe<Array<Maybe<DemographicsItemYear>>>;
  keys?: Maybe<Array<Maybe<Scalars['String']>>>;
  year?: Maybe<DemographicsItemYear>;
};


export type SourceYearArgs = {
  year: Scalars['Int'];
};

export type SourceFilter = {
  eq?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** A survey */
export type Survey = {
  __typename?: 'Survey';
  bracket_matchups?: Maybe<BracketMatchups>;
  /** Brackets */
  bracket_wins?: Maybe<BracketWins>;
  /** Data about a specific tool category */
  category?: Maybe<Category>;
  /** Demographics data (gender, company size, salary, etc.) */
  demographics?: Maybe<Demographics>;
  /**
   * Environments data, for those based on multiple choices,
   * such as browsers, form factors... Only contain predifined
   * choices, freeform answers are stored in `environmentsOthers`.
   */
  environments?: Maybe<Environments>;
  /** Environments data, for those based on rating, such as css for emails... */
  environments_ratings?: Maybe<EnvironmentsRatings>;
  /** Usage results for a specific feature */
  feature?: Maybe<Feature>;
  /** Usage results for a range of features */
  features?: Maybe<Array<Maybe<Feature>>>;
  /** Choice based features */
  features_others?: Maybe<OtherFeatures>;
  /** Happiness data, either for a specific category or more generally */
  happiness?: Maybe<Happiness>;
  /** Matrices data (used for cross-referencing heatmap charts) */
  matrices?: Maybe<Matrices>;
  /** Opinions data */
  opinion?: Maybe<Opinion>;
  /** Opinions data */
  opinions_others?: Maybe<OtherOpinions>;
  /** Proficiency data, such as backend proficiency, javascript... */
  proficiency?: Maybe<Proficiency>;
  /** Resources (sites, blogs, podcasts, etc.) */
  resources?: Maybe<Resources>;
  /** The survey's name */
  surveyName?: Maybe<SurveyType>;
  /** Experience results for a specific tool */
  tool?: Maybe<Tool>;
  /** Experience results for a range of tools */
  tools?: Maybe<Array<Maybe<Tool>>>;
  /** Cardinality By User (by-users tool count breakdown for a specific set of tools and specific criteria) */
  tools_cardinality_by_user?: Maybe<Array<Maybe<ToolsCardinalityByUser>>>;
  /** Other tools (browsers, editors, etc.) */
  tools_others?: Maybe<OtherTools>;
  /** Rankings (awareness, interest, satisfaction) for a range of tools */
  tools_rankings?: Maybe<ToolsRankings>;
  /** Total responses */
  totals?: Maybe<Totals>;
};


/** A survey */
export type SurveyBracket_MatchupsArgs = {
  filters?: InputMaybe<Filters>;
  id: BracketId;
  options?: InputMaybe<Options>;
};


/** A survey */
export type SurveyBracket_WinsArgs = {
  filters?: InputMaybe<Filters>;
  id: BracketId;
  options?: InputMaybe<Options>;
};


/** A survey */
export type SurveyCategoryArgs = {
  id: CategoryId;
};


/** A survey */
export type SurveyEnvironmentsArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  id: EnvironmentId;
  options?: InputMaybe<Options>;
};


/** A survey */
export type SurveyEnvironments_RatingsArgs = {
  filters?: InputMaybe<Filters>;
  id: EnvironmentId;
};


/** A survey */
export type SurveyFeatureArgs = {
  id: FeatureId;
};


/** A survey */
export type SurveyFeaturesArgs = {
  ids?: InputMaybe<Array<InputMaybe<FeatureId>>>;
};


/** A survey */
export type SurveyFeatures_OthersArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  id: OtherFeaturesId;
  options?: InputMaybe<Options>;
};


/** A survey */
export type SurveyHappinessArgs = {
  filters?: InputMaybe<Filters>;
  id: HappinessId;
};


/** A survey */
export type SurveyOpinionArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  id: OpinionId;
  options?: InputMaybe<Options>;
};


/** A survey */
export type SurveyOpinions_OthersArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  id: OtherOpinionsId;
  options?: InputMaybe<Options>;
};


/** A survey */
export type SurveyProficiencyArgs = {
  filters?: InputMaybe<Filters>;
  id: ProficiencyId;
};


/** A survey */
export type SurveyResourcesArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  id: ResourcesId;
  options?: InputMaybe<Options>;
};


/** A survey */
export type SurveyToolArgs = {
  id: ToolId;
};


/** A survey */
export type SurveyToolsArgs = {
  ids?: InputMaybe<Array<InputMaybe<ToolId>>>;
};


/** A survey */
export type SurveyTools_Cardinality_By_UserArgs = {
  experienceId: ToolExperienceId;
  ids: Array<InputMaybe<ToolId>>;
  year: Scalars['Int'];
};


/** A survey */
export type SurveyTools_OthersArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  id: OtherToolsId;
  options?: InputMaybe<Options>;
};


/** A survey */
export type SurveyTools_RankingsArgs = {
  ids: Array<InputMaybe<ToolId>>;
};


/** A survey */
export type SurveyTotalsArgs = {
  filters?: InputMaybe<Filters>;
};

export type SurveyData = {
  __typename?: 'SurveyData';
  foo?: Maybe<Scalars['String']>;
};

export type SurveyEditionColors = {
  __typename?: 'SurveyEditionColors';
  background?: Maybe<Scalars['String']>;
  backgroundSecondary?: Maybe<Scalars['String']>;
  primary?: Maybe<Scalars['String']>;
  secondary?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export type SurveyEditionConfig = {
  __typename?: 'SurveyEditionConfig';
  colors?: Maybe<SurveyEditionColors>;
  endedAt?: Maybe<Scalars['String']>;
  faviconUrl?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  questionsUrl?: Maybe<Scalars['String']>;
  resultsUrl?: Maybe<Scalars['String']>;
  shareUrl?: Maybe<Scalars['String']>;
  socialImageUrl?: Maybe<Scalars['String']>;
  startedAt?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['Int']>;
  surveyId?: Maybe<Scalars['String']>;
  year?: Maybe<Scalars['Int']>;
};

/** All surveys */
export type SurveyItem = {
  __typename?: 'SurveyItem';
  data?: Maybe<SurveyData>;
  domain?: Maybe<Scalars['String']>;
  editions?: Maybe<Array<Maybe<SurveyEditionConfig>>>;
  emailOctopus?: Maybe<EmailOctopusConfig>;
  hashtag?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
};

export enum SurveyType {
  StateOfCss = 'state_of_css',
  StateOfGraphql = 'state_of_graphql',
  StateOfJs = 'state_of_js'
}

export type Tool = {
  __typename?: 'Tool';
  entity?: Maybe<Entity>;
  experience?: Maybe<ToolExperience>;
  experienceAggregated?: Maybe<ToolExperienceAggregated>;
  experienceGraph?: Maybe<ToolExperienceGraph>;
  experienceTransitions?: Maybe<ToolExperienceTransitions>;
  id: ToolId;
};


export type ToolExperienceArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  options?: InputMaybe<Options>;
};


export type ToolExperienceAggregatedArgs = {
  facet?: InputMaybe<Facet>;
  filters?: InputMaybe<Filters>;
  options?: InputMaybe<Options>;
};


export type ToolExperienceGraphArgs = {
  filters?: InputMaybe<Filters>;
};


export type ToolExperienceTransitionsArgs = {
  year: Scalars['Int'];
};

/**
 * Experience ranking for a tool in a specific year, even if the data
 * is computed at the same point in time, we estimate that there is a logical
 * progression in this:
 *
 * awareness > usage > interest > satisfaction
 */
export type ToolAwarenessUsageInterestSatisfaction = {
  __typename?: 'ToolAwarenessUsageInterestSatisfaction';
  /**
   * Awareness is the total number of participants who answered to
   * the experience question VS those who never heard of a tool.
   *
   * This value is expressed as a percentage.
   */
  awareness?: Maybe<Scalars['Float']>;
  /**
   * Interest is the ratio of participants who heard of tool and
   * are interested/not interested VS those who are only interested in it.
   *
   * This value is expressed as a percentage.
   */
  interest?: Maybe<Scalars['Float']>;
  /**
   * Satisfaction is the ratio of participants who used of tool and
   * are satisfied/not satisfied VS those who are willing to use it again.
   *
   * This value is expressed as a percentage.
   */
  satisfaction?: Maybe<Scalars['Float']>;
  /**
   * Usage is the total number of participants who used the tool,
   * include both users willing to use it again and those who wouldn't.
   *
   * This value is expressed as a percentage.
   */
  usage?: Maybe<Scalars['Float']>;
};

export type ToolExperience = {
  __typename?: 'ToolExperience';
  all_years?: Maybe<Array<Maybe<ToolYearExperience>>>;
  keys?: Maybe<Array<Maybe<ToolExperienceId>>>;
  year?: Maybe<ToolYearExperience>;
};


export type ToolExperienceYearArgs = {
  year: Scalars['Int'];
};

export type ToolExperienceAggregated = {
  __typename?: 'ToolExperienceAggregated';
  all_years?: Maybe<Array<Maybe<ToolYearExperienceAggregated>>>;
  keys?: Maybe<Array<Maybe<ToolExperienceId>>>;
  year?: Maybe<ToolYearExperienceAggregated>;
};


export type ToolExperienceAggregatedYearArgs = {
  year: Scalars['Int'];
};

/** Aggregate the experience of multiple tools */
export type ToolExperienceAggregatedBucket = {
  __typename?: 'ToolExperienceAggregatedBucket';
  count?: Maybe<Scalars['Int']>;
  countDelta?: Maybe<Scalars['Int']>;
  ids?: Maybe<Array<Maybe<ToolExperienceId>>>;
  percentageDelta?: Maybe<Scalars['Float']>;
  percentage_facet?: Maybe<Scalars['Float']>;
  percentage_question?: Maybe<Scalars['Float']>;
  percentage_survey?: Maybe<Scalars['Float']>;
};

export type ToolExperienceAggregatedFacet = {
  __typename?: 'ToolExperienceAggregatedFacet';
  buckets?: Maybe<Array<Maybe<ToolExperienceAggregatedBucket>>>;
  id?: Maybe<Scalars['String']>;
  type?: Maybe<Facet>;
};

/**
 * An aggregation bucket for tool experience containing both an absolute count
 * for the parent year, and the percentage it corresponds to regarding
 * the total number of respondents who have answered the question
 * in this particular year.
 */
export type ToolExperienceBucket = {
  __typename?: 'ToolExperienceBucket';
  count?: Maybe<Scalars['Int']>;
  countDelta?: Maybe<Scalars['Int']>;
  id?: Maybe<ToolExperienceId>;
  percentageDelta?: Maybe<Scalars['Float']>;
  percentage_facet?: Maybe<Scalars['Float']>;
  percentage_question?: Maybe<Scalars['Float']>;
  percentage_survey?: Maybe<Scalars['Float']>;
};

/** Tool data for a specific facet */
export type ToolExperienceFacet = {
  __typename?: 'ToolExperienceFacet';
  buckets?: Maybe<Array<Maybe<ToolExperienceBucket>>>;
  completion?: Maybe<FacetCompletion>;
  id?: Maybe<Scalars['String']>;
  type?: Maybe<Facet>;
};

/**
 * A graph of users' experience over years, compared to just computing
 * the overall choice count for each year, this keeps continuity for each user.
 */
export type ToolExperienceGraph = {
  __typename?: 'ToolExperienceGraph';
  links?: Maybe<Array<Maybe<ToolExperienceGraphLink>>>;
  nodes?: Maybe<Array<Maybe<ToolExperienceGraphNode>>>;
};

/**
 * Track number of connections between 2 nodes,
 * for example number of user who were interested in React in 206
 * and are willing to use it in 2017, connections are only established
 * for consecutive years.
 */
export type ToolExperienceGraphLink = {
  __typename?: 'ToolExperienceGraphLink';
  count?: Maybe<Scalars['Int']>;
  source?: Maybe<Scalars['String']>;
  target?: Maybe<Scalars['String']>;
};

export type ToolExperienceGraphNode = {
  __typename?: 'ToolExperienceGraphNode';
  experience?: Maybe<ToolExperienceId>;
  id?: Maybe<Scalars['String']>;
  year?: Maybe<Scalars['Int']>;
};

export enum ToolExperienceId {
  Interested = 'interested',
  NeverHeard = 'never_heard',
  NotInterested = 'not_interested',
  WouldNotUse = 'would_not_use',
  WouldUse = 'would_use'
}

/**
 * Used to represent the ranking of a tool compared to others
 * for awareness/interest and stisfaction.
 */
export type ToolExperienceRanking = {
  __typename?: 'ToolExperienceRanking';
  awareness?: Maybe<Array<Maybe<ToolExperienceRankingYearMetric>>>;
  entity?: Maybe<Entity>;
  id?: Maybe<ToolId>;
  interest?: Maybe<Array<Maybe<ToolExperienceRankingYearMetric>>>;
  satisfaction?: Maybe<Array<Maybe<ToolExperienceRankingYearMetric>>>;
  usage?: Maybe<Array<Maybe<ToolExperienceRankingYearMetric>>>;
};

export type ToolExperienceRankingYearMetric = {
  __typename?: 'ToolExperienceRankingYearMetric';
  percentage_facet?: Maybe<Scalars['Float']>;
  percentage_question?: Maybe<Scalars['Float']>;
  percentage_survey?: Maybe<Scalars['Float']>;
  rank?: Maybe<Scalars['Int']>;
  year?: Maybe<Scalars['Int']>;
};

export type ToolExperienceTransitions = {
  __typename?: 'ToolExperienceTransitions';
  keys?: Maybe<Array<Maybe<ToolExperienceId>>>;
  nodes?: Maybe<Array<Maybe<ToolExperienceTransitionsNode>>>;
  tool?: Maybe<ToolId>;
  transitions?: Maybe<Array<Maybe<ToolExperienceTransitionsTransition>>>;
};

export type ToolExperienceTransitionsNode = {
  __typename?: 'ToolExperienceTransitionsNode';
  choice?: Maybe<ToolExperienceId>;
  count?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['String']>;
  year?: Maybe<Scalars['Int']>;
};

export type ToolExperienceTransitionsTransition = {
  __typename?: 'ToolExperienceTransitionsTransition';
  count?: Maybe<Scalars['Int']>;
  from?: Maybe<Scalars['String']>;
  percentage?: Maybe<Scalars['Int']>;
  to?: Maybe<Scalars['String']>;
};

export enum ToolId {
  Alpinejs = 'alpinejs',
  Angular = 'angular',
  AntDesign = 'ant_design',
  Apollo = 'apollo',
  AssemblerCss = 'assembler_css',
  Astro = 'astro',
  Astroturf = 'astroturf',
  AtomicCss = 'atomic_css',
  Ava = 'ava',
  Bem = 'bem',
  Blitz = 'blitz',
  Bootstrap = 'bootstrap',
  Browserify = 'browserify',
  Bulma = 'bulma',
  Capacitor = 'capacitor',
  Clojurescript = 'clojurescript',
  Cordova = 'cordova',
  CssModules = 'css_modules',
  CubeCss = 'cube_css',
  Cypress = 'cypress',
  Electron = 'electron',
  Eleventy = 'eleventy',
  Elm = 'elm',
  Ember = 'ember',
  Emotion = 'emotion',
  Enzyme = 'enzyme',
  Esbuild = 'esbuild',
  Expo = 'expo',
  Express = 'express',
  Fastify = 'fastify',
  Feathers = 'feathers',
  Fela = 'fela',
  Foundation = 'foundation',
  Gatsby = 'gatsby',
  Graphql = 'graphql',
  Gulp = 'gulp',
  Halfmoon = 'halfmoon',
  Hapi = 'hapi',
  Ionic = 'ionic',
  ItCss = 'it_css',
  Jasmine = 'jasmine',
  Jest = 'jest',
  Jss = 'jss',
  Koa = 'koa',
  Lerna = 'lerna',
  Less = 'less',
  Linaria = 'linaria',
  Litelement = 'litelement',
  MaterializeCss = 'materialize_css',
  Meteor = 'meteor',
  Mobx = 'mobx',
  Mocha = 'mocha',
  Nativeapps = 'nativeapps',
  Nest = 'nest',
  Nextjs = 'nextjs',
  NpmWorkspaces = 'npm_workspaces',
  Nuxt = 'nuxt',
  Nwjs = 'nwjs',
  Nx = 'nx',
  Oocss = 'oocss',
  Parcel = 'parcel',
  Playwright = 'playwright',
  Pnpm = 'pnpm',
  PostCss = 'post_css',
  Preact = 'preact',
  Primer = 'primer',
  Puppeteer = 'puppeteer',
  PureCss = 'pure_css',
  Purescript = 'purescript',
  Quasar = 'quasar',
  Radium = 'radium',
  React = 'react',
  Reactnative = 'reactnative',
  Reason = 'reason',
  Redux = 'redux',
  Redwood = 'redwood',
  Relay = 'relay',
  Remix = 'remix',
  Rollup = 'rollup',
  Rome = 'rome',
  Rush = 'rush',
  Sails = 'sails',
  Sass = 'sass',
  SemanticUi = 'semantic_ui',
  Skeleton = 'skeleton',
  Smacss = 'smacss',
  Snowpack = 'snowpack',
  Solid = 'solid',
  SpectreCss = 'spectre_css',
  Stimulus = 'stimulus',
  Stitches = 'stitches',
  Storybook = 'storybook',
  Strapi = 'strapi',
  StyledComponents = 'styled_components',
  StyledJsx = 'styled_jsx',
  StyledSystem = 'styled_system',
  Styletron = 'styletron',
  Stylus = 'stylus',
  Svelte = 'svelte',
  Sveltekit = 'sveltekit',
  Swc = 'swc',
  Tachyons = 'tachyons',
  TailwindCss = 'tailwind_css',
  Tauri = 'tauri',
  TestingLibrary = 'testing_library',
  ThemeUi = 'theme_ui',
  Tsc = 'tsc',
  Turborepo = 'turborepo',
  Twin = 'twin',
  Typescript = 'typescript',
  UiKit = 'ui_kit',
  VanillaExtract = 'vanilla_extract',
  Vite = 'vite',
  Vitest = 'vitest',
  Vuejs = 'vuejs',
  Vuex = 'vuex',
  Webdriverio = 'webdriverio',
  Webpack = 'webpack',
  WindiCss = 'windi_css',
  Wmr = 'wmr',
  Xstate = 'xstate',
  Yalc = 'yalc',
  YarnWorkspaces = 'yarn_workspaces'
}

export type ToolMatrix = {
  __typename?: 'ToolMatrix';
  buckets?: Maybe<Array<Maybe<MatrixBucket>>>;
  count?: Maybe<Scalars['Int']>;
  entity?: Maybe<Entity>;
  id?: Maybe<ToolId>;
  percentage?: Maybe<Scalars['Float']>;
  total?: Maybe<Scalars['Int']>;
};

export enum ToolMatrixExperienceId {
  /** `never_heard` VS total (inverted) */
  Awareness = 'awareness',
  /** `interested` VS `not_interested` */
  Interest = 'interest',
  Interested = 'interested',
  /** `would_not_use` + `not_interested` VS `would_use` + `would_not_use` + `interested` + `not_interested` */
  NegativeSentiment = 'negative_sentiment',
  NeverHeard = 'never_heard',
  NotInterested = 'not_interested',
  /** `would_use` + `interested` VS `would_use` + `would_not_use` + `interested` + `not_interested` */
  PositiveSentiment = 'positive_sentiment',
  /** `would_use` VS `would_not_use` */
  Satisfaction = 'satisfaction',
  /** `would_use` + `would_not_use` VS total */
  Usage = 'usage',
  WouldNotUse = 'would_not_use',
  WouldUse = 'would_use'
}

export type ToolYearExperience = {
  __typename?: 'ToolYearExperience';
  completion?: Maybe<YearCompletion>;
  facets?: Maybe<Array<Maybe<ToolExperienceFacet>>>;
  year?: Maybe<Scalars['Int']>;
};

export type ToolYearExperienceAggregated = {
  __typename?: 'ToolYearExperienceAggregated';
  facets?: Maybe<Array<Maybe<ToolExperienceAggregatedFacet>>>;
  year?: Maybe<Scalars['Int']>;
};

export type ToolsCardinalityByUser = {
  __typename?: 'ToolsCardinalityByUser';
  cardinality?: Maybe<Scalars['Int']>;
  count?: Maybe<Scalars['Int']>;
  /** Percentage against number of respondents for the related year. */
  percentage_survey?: Maybe<Scalars['Float']>;
};

export type ToolsExperienceDimensionMatrix = {
  __typename?: 'ToolsExperienceDimensionMatrix';
  dimension?: Maybe<MatrixDimensionId>;
  tools?: Maybe<Array<Maybe<ToolMatrix>>>;
};

export type ToolsExperienceMatrices = {
  __typename?: 'ToolsExperienceMatrices';
  dimensions?: Maybe<Array<Maybe<ToolsExperienceDimensionMatrix>>>;
  experience?: Maybe<ToolMatrixExperienceId>;
};

/** Contains various rankings for a set of tools. */
export type ToolsRankings = {
  __typename?: 'ToolsRankings';
  experience?: Maybe<Array<Maybe<ToolExperienceRanking>>>;
  ids: Array<Maybe<ToolId>>;
  years?: Maybe<Array<Maybe<Scalars['Int']>>>;
};


/** Contains various rankings for a set of tools. */
export type ToolsRankingsExperienceArgs = {
  filters?: InputMaybe<Filters>;
};

export type Totals = {
  __typename?: 'Totals';
  all_years?: Maybe<Scalars['Int']>;
  year?: Maybe<Scalars['Int']>;
};


export type TotalsYearArgs = {
  year: Scalars['Int'];
};

export type TranslationString = {
  __typename?: 'TranslationString';
  aliasFor?: Maybe<Scalars['String']>;
  context?: Maybe<Scalars['String']>;
  fallback?: Maybe<Scalars['Boolean']>;
  key?: Maybe<Scalars['String']>;
  t?: Maybe<Scalars['String']>;
  tHtml?: Maybe<Scalars['String']>;
};

export type Twitter = {
  __typename?: 'Twitter';
  avatarUrl?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  publicMetrics?: Maybe<TwittterPublicMetrics>;
  userName?: Maybe<Scalars['String']>;
};

export type TwittterPublicMetrics = {
  __typename?: 'TwittterPublicMetrics';
  followers?: Maybe<Scalars['Int']>;
  following?: Maybe<Scalars['Int']>;
  listed?: Maybe<Scalars['Int']>;
  tweet?: Maybe<Scalars['Int']>;
};

export type WorkExperience = {
  __typename?: 'WorkExperience';
  all_years?: Maybe<Array<Maybe<DemographicsItemYear>>>;
  keys?: Maybe<Array<Maybe<WorkExperienceRange>>>;
  year?: Maybe<DemographicsItemYear>;
};


export type WorkExperienceYearArgs = {
  year: Scalars['Int'];
};

export enum WorkExperienceRange {
  Range_1_2 = 'range_1_2',
  Range_2_5 = 'range_2_5',
  Range_5_10 = 'range_5_10',
  Range_10_20 = 'range_10_20',
  RangeLessThan_1 = 'range_less_than_1',
  RangeMoreThan_20 = 'range_more_than_20'
}

export type YearBracketMatchups = {
  __typename?: 'YearBracketMatchups';
  completion?: Maybe<YearCompletion>;
  facets?: Maybe<Array<Maybe<BracketMatchupsFacet>>>;
  year?: Maybe<Scalars['Int']>;
};

export type YearBracketWins = {
  __typename?: 'YearBracketWins';
  completion?: Maybe<YearCompletion>;
  facets?: Maybe<Array<Maybe<BracketWinsFacet>>>;
  year?: Maybe<Scalars['Int']>;
};

/** Completion ratio and count */
export type YearCompletion = {
  __typename?: 'YearCompletion';
  /** Number of respondents who have answered this question for a specific year */
  count?: Maybe<Scalars['Int']>;
  /** Completion percentage relative to total number of survey respondents for a given year */
  percentage_survey?: Maybe<Scalars['Float']>;
  /** Total number of respondents who have answered the survey for a specific year */
  total?: Maybe<Scalars['Int']>;
};

export type YearEnvironments = {
  __typename?: 'YearEnvironments';
  completion?: Maybe<YearCompletion>;
  facets?: Maybe<Array<Maybe<EntityFacet>>>;
  year?: Maybe<Scalars['Int']>;
};

export type YearEnvironmentsRatings = {
  __typename?: 'YearEnvironmentsRatings';
  buckets?: Maybe<Array<Maybe<EnvironmentRatingBucket>>>;
  completion?: Maybe<YearCompletion>;
  year?: Maybe<Scalars['Int']>;
};

/** Feature data for a specific year */
export type YearFeature = {
  __typename?: 'YearFeature';
  completion?: Maybe<YearCompletion>;
  facets?: Maybe<Array<Maybe<FeatureFacet>>>;
  year?: Maybe<Scalars['Int']>;
};

export type YearHappiness = {
  __typename?: 'YearHappiness';
  completion?: Maybe<YearCompletion>;
  facets?: Maybe<Array<Maybe<HappinessFacet>>>;
  /**
   * Mean happiness score for the year, please note that despite the
   * happiness indices starts at 0, the average is computed from 1.
   */
  mean?: Maybe<Scalars['Float']>;
  year?: Maybe<Scalars['Int']>;
};

export type YearOpinion = {
  __typename?: 'YearOpinion';
  completion?: Maybe<YearCompletion>;
  facets?: Maybe<Array<Maybe<OpinionFacet>>>;
  /**
   * Mean opinion score for the year, please note that despite the
   * opinion indices starts at 0, the average is computed from 1.
   */
  mean?: Maybe<Scalars['Float']>;
  year?: Maybe<Scalars['Int']>;
};

export type YearOtherFeatures = {
  __typename?: 'YearOtherFeatures';
  buckets?: Maybe<Array<Maybe<FeatureBucket>>>;
  completion?: Maybe<YearCompletion>;
  year?: Maybe<Scalars['Int']>;
};

export type YearOtherOpinions = {
  __typename?: 'YearOtherOpinions';
  completion?: Maybe<YearCompletion>;
  facets?: Maybe<Array<Maybe<EntityFacet>>>;
  year?: Maybe<Scalars['Int']>;
};

export type YearOtherTools = {
  __typename?: 'YearOtherTools';
  completion?: Maybe<YearCompletion>;
  facets?: Maybe<Array<Maybe<EntityFacet>>>;
  year?: Maybe<Scalars['Int']>;
};

/** Participation */
export type YearParticipation = {
  __typename?: 'YearParticipation';
  participants?: Maybe<Scalars['Int']>;
  year?: Maybe<Scalars['Int']>;
};

export type YearProficiency = {
  __typename?: 'YearProficiency';
  buckets?: Maybe<Array<Maybe<ProficiencyBucket>>>;
  completion?: Maybe<YearCompletion>;
  year?: Maybe<Scalars['Int']>;
};

export type YearResources = {
  __typename?: 'YearResources';
  completion?: Maybe<YearCompletion>;
  facets?: Maybe<Array<Maybe<EntityFacet>>>;
  year?: Maybe<Scalars['Int']>;
};

export type YearlySalaryRangeFilter = {
  eq?: InputMaybe<SalaryRange>;
  in?: InputMaybe<Array<InputMaybe<SalaryRange>>>;
  nin?: InputMaybe<Array<InputMaybe<SalaryRange>>>;
};

export type YearsOfExperienceFilter = {
  eq?: InputMaybe<WorkExperienceRange>;
  in?: InputMaybe<Array<InputMaybe<WorkExperienceRange>>>;
  nin?: InputMaybe<Array<InputMaybe<WorkExperienceRange>>>;
};

export type CountryQueryVariables = Exact<{ [key: string]: never; }>;


export type CountryQuery = { __typename?: 'Query', survey?: { __typename?: 'Survey', demographics?: { __typename?: 'Demographics', country?: { __typename?: 'Country', keys?: Array<CountryId | undefined> | undefined, year?: { __typename?: 'DemographicsItemYear', year?: number | undefined, completion?: { __typename?: 'YearCompletion', total?: number | undefined, percentage_survey?: number | undefined, count?: number | undefined } | undefined, facets?: Array<{ __typename?: 'EntityFacet', id?: string | undefined, type?: Facet | undefined, completion?: { __typename?: 'FacetCompletion', total?: number | undefined, percentage_question?: number | undefined, percentage_survey?: number | undefined, count?: number | undefined } | undefined, buckets?: Array<{ __typename?: 'EntityBucket', id?: string | undefined, count?: number | undefined, percentage_question?: number | undefined, percentage_survey?: number | undefined } | undefined> | undefined } | undefined> | undefined } | undefined } | undefined } | undefined } | undefined };

export type LocaleQueryVariables = Exact<{ [key: string]: never; }>;


export type LocaleQuery = { __typename?: 'Query', survey?: { __typename?: 'Survey', demographics?: { __typename?: 'Demographics', locale?: { __typename?: 'LocaleStats', keys?: Array<string | undefined> | undefined, year?: { __typename?: 'DemographicsItemYear', year?: number | undefined, completion?: { __typename?: 'YearCompletion', total?: number | undefined, percentage_survey?: number | undefined, count?: number | undefined } | undefined, facets?: Array<{ __typename?: 'EntityFacet', id?: string | undefined, type?: Facet | undefined, completion?: { __typename?: 'FacetCompletion', total?: number | undefined, percentage_question?: number | undefined, percentage_survey?: number | undefined, count?: number | undefined } | undefined, buckets?: Array<{ __typename?: 'EntityBucket', id?: string | undefined, count?: number | undefined, percentage_question?: number | undefined, percentage_survey?: number | undefined } | undefined> | undefined } | undefined> | undefined } | undefined } | undefined } | undefined } | undefined };


export const CountryDocument = `
    query country {
  survey(survey: state_of_js) {
    demographics {
      country: country(filters: {}, options: {}, facet: null) {
        keys
        year(year: 2021) {
          year
          completion {
            total
            percentage_survey
            count
          }
          facets {
            id
            type
            completion {
              total
              percentage_question
              percentage_survey
              count
            }
            buckets {
              id
              count
              percentage_question
              percentage_survey
            }
          }
        }
      }
    }
  }
}
    `;
export const useCountryQuery = <
      TData = CountryQuery,
      TError = unknown
    >(
      variables?: CountryQueryVariables,
      options?: UseQueryOptions<CountryQuery, TError, TData>
    ) =>
    useQuery<CountryQuery, TError, TData>(
      variables === undefined ? ['country'] : ['country', variables],
      fetcher<CountryQuery, CountryQueryVariables>(CountryDocument, variables),
      options
    );
export const LocaleDocument = `
    query locale {
  survey(survey: state_of_js) {
    demographics {
      locale: locale(filters: {}, options: {cutoff: 20}, facet: null) {
        keys
        year(year: 2021) {
          year
          completion {
            total
            percentage_survey
            count
          }
          facets {
            id
            type
            completion {
              total
              percentage_question
              percentage_survey
              count
            }
            buckets {
              id
              count
              percentage_question
              percentage_survey
            }
          }
        }
      }
    }
  }
}
    `;
export const useLocaleQuery = <
      TData = LocaleQuery,
      TError = unknown
    >(
      variables?: LocaleQueryVariables,
      options?: UseQueryOptions<LocaleQuery, TError, TData>
    ) =>
    useQuery<LocaleQuery, TError, TData>(
      variables === undefined ? ['locale'] : ['locale', variables],
      fetcher<LocaleQuery, LocaleQueryVariables>(LocaleDocument, variables),
      options
    );