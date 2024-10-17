import React from 'react';
import ContentLoader, { IContentLoaderProps } from 'react-content-loader';

export const ProductDetailLoader = (props?: Partial<IContentLoaderProps>) => (
  <ContentLoader
    className="h-screen w-fit"
    speed={2}
    width={1200}
    height={500}
    viewBox="0 0 1000 500"
    backgroundColor="#f5f5f5"
    foregroundColor="#dbdbdb"
    {...props}
  >
    <rect x="12" y="12" rx="0" ry="0" width="282" height="232" />
    <rect x="340" y="101" rx="5" ry="5" width="220" height="10" />
    <rect x="340" y="121" rx="5" ry="5" width="220" height="10" />
    <rect x="340" y="140" rx="5" ry="5" width="220" height="10" />
    <rect x="340" y="162" rx="5" ry="5" width="220" height="10" />
    <rect x="340" y="184" rx="5" ry="5" width="220" height="10" />
    <rect x="340" y="206" rx="5" ry="5" width="220" height="10" />
    <rect x="340" y="15" rx="0" ry="0" width="153" height="18" />
    <rect x="340" y="232" rx="5" ry="5" width="220" height="10" />

    <rect x="-1" y="-6" rx="0" ry="0" width="6" height="264" /> 
    <rect x="571" y="-13" rx="0" ry="0" width="6" height="269" /> 
    <rect x="-4" y="253" rx="0" ry="0" width="581" height="7" /> 
    <rect x="-3" y="-1" rx="0" ry="0" width="575" height="7" />
  </ContentLoader>
);
