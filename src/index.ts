import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'
import { isAbstractMenuManager } from '@jbrowse/core/util'
import { version } from '../package.json'
import { ReactComponent } from './HelloView'

import { AnyConfigurationModel, ConfigurationSchema } from '@jbrowse/core/configuration/configurationSchema';
import SerializableFilterChain from '@jbrowse/core/pluggableElementTypes/renderers/util/serializableFilterChain';
import BoxRendererType, { LayoutSession } from '@jbrowse/core/pluggableElementTypes/renderers/BoxRendererType'

import {
  svgFeatureRendererConfigSchema,
  SvgFeatureRendererReactComponent,
} from '@jbrowse/plugin-svg';

export default class MyProjectPlugin extends Plugin {
  name = 'MyProject'
  version = version

  install(pluginManager: PluginManager) {
    const { jbrequire } = pluginManager
    const { types } = pluginManager.lib['mobx-state-tree']

    const ViewType = jbrequire('@jbrowse/core/pluggableElementTypes/ViewType')
    const stateModel = types
      .model({ type: types.literal('HelloView') })
      .actions(() => ({
        setWidth() {
          // unused but required by your view
        },
      }))

    pluginManager.addViewType(() => {
      return new ViewType({ name: 'HelloView', stateModel, ReactComponent })
    })

    class SvgFeatureRenderer2 extends BoxRendererType {
      supportsSVG = true;
    }


    const svgFeatureRenderer2ConfigSchema = ConfigurationSchema(
      'SvgFeatureRenderer2',
      {},
      { baseConfiguration: svgFeatureRendererConfigSchema,
        explicitlyTyped: true }
    );

    pluginManager.addRendererType(
      () =>
        new SvgFeatureRenderer2({
          name: 'SvgFeatureRenderer2',
          ReactComponent: SvgFeatureRendererReactComponent,
          configSchema: svgFeatureRenderer2ConfigSchema,
          pluginManager: pluginManager,
        }),
    )

    //@ts-ignore
    console.log("LayoutSession == null: " + (LayoutSession == null));
  }

  configure(pluginManager: PluginManager) {
    if (isAbstractMenuManager(pluginManager.rootModel)) {
      // @ts-ignore
      pluginManager.rootModel.appendToSubMenu(['File', 'Add'], {
        label: 'Open Hello!',
        // @ts-ignore
        onClick: session => {
          session.addView('HelloView', {})
        },
      })
    }
  }
}
