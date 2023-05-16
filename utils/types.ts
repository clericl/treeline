import {Geometry} from 'geojson';
import {ReactNode} from 'react';

export type TreeDatumType = {
  id: string;
  species: string;
  condition: string;
  diameter: number;
  location: {
    longitude: number;
    latitude: number;
  };
};

export type NtaDatumType = {
  ntaCode: string;
  ntaName: string;
  geometry: Geometry;
  treeCount: number;
  center: {
    longitude: number;
    latitude: number;
  };
};

export type SpeciesNameType = {
  id: string;
  title: string;
};

export type ControllerProps = {
  children: ReactNode;
};
