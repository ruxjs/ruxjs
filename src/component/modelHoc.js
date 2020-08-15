import { connect  } from 'react-redux'

import { mapModels } from '../model'

/**
 * Inject the entire model directly into the component
 * @param nameSpace model nameSpace
 */
function model(nameSpace){
    return (Content) => connect((store) => mapModels(nameSpace,store))(Content)
}

export default model