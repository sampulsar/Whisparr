using System.Collections.Generic;
using System.Linq;
using NzbDrone.Common.Extensions;
using NzbDrone.Core.Messaging.Events;
using NzbDrone.Core.Movies.Studios.Events;
using NzbDrone.Core.Parser;

namespace NzbDrone.Core.Movies.Studios
{
    public interface IStudioService
    {
        Studio AddStudio(Studio studio);
        List<Studio> AddStudios(List<Studio> studios);
        List<Studio> GetStudios(IEnumerable<int> studioIds);
        Studio GetById(int id);
        Studio FindByForeignId(string foreignId);
        List<Studio> GetAllStudios();
        List<string> AllStudioForeignIds();
        Studio Update(Studio performer);
        List<Studio> Update(List<Studio> studios);
        Studio FindByTitle(string title);
        List<Studio> FindAllByTitle(string title);
        void RemoveStudio(Studio studio);
    }

    public class StudioService : IStudioService
    {
        private readonly IStudioRepository _studioRepo;
        private readonly IEventAggregator _eventAggregator;
        private readonly Dictionary<string, string> _aliases;

        public StudioService(IStudioRepository studioRepo, IEventAggregator eventAggregator)
        {
            _studioRepo = studioRepo;
            _eventAggregator = eventAggregator;

            // Key Other name on indexer, Value StashDB value.
            _aliases = new Dictionary<string, string>();
            var allStudios = GetAllStudios();
            foreach (var studio in allStudios)
            {
                if (studio.Network.IsNotNullOrWhiteSpace())
                {
                    if (!_aliases.ContainsKey(studio.Title))
                    {
                        var value = studio.Network;
                        if (value == "Anal Vids")
                        {
                            value = "LegalPorno";
                        }

                        if (value == "The Score Group")
                        {
                            value = "PornMegaLoad";
                        }

                        if (value == "ManyVids")
                        {
                            value = $"ManyVids {studio.Title}";
                        }

                        _aliases.Add(studio.Title, value);
                    }
                }
            }

            _aliases.Add("ExCoGiGirls", "Exploited College Girls");
            _aliases.Add("bex", "Brazzers Exxtra");
            _aliases.Add("lanewgirl", "L.A. New Girl");
            _aliases.Add("Nubiles", "Nubiles.net");
            _aliases.Add("TeamSkeetVIP", "TeamSkeet Features");
            _aliases.Add("Wicked Pictures", "Wicked");
        }

        public Studio AddStudio(Studio newStudio)
        {
            var studio = _studioRepo.Insert(newStudio);

            _eventAggregator.PublishEvent(new StudioAddedEvent(GetById(studio.Id)));

            return studio;
        }

        public List<Studio> AddStudios(List<Studio> studios)
        {
            _studioRepo.InsertMany(studios);

            _eventAggregator.PublishEvent(new StudiosAddedEvent(studios));

            return studios;
        }

        public Studio GetById(int id)
        {
            return _studioRepo.Get(id);
        }

        public List<Studio> GetStudios(IEnumerable<int> studioIds)
        {
            return _studioRepo.Get(studioIds).ToList();
        }

        public List<Studio> GetAllStudios()
        {
            return _studioRepo.All().ToList();
        }

        public Studio Update(Studio studio)
        {
            return _studioRepo.Update(studio);
        }

        public List<Studio> Update(List<Studio> studios)
        {
            _studioRepo.UpdateMany(studios);

            return studios;
        }

        public void RemoveStudio(Studio studio)
        {
            _studioRepo.Delete(studio);
        }

        public Studio FindByTitle(string title)
        {
            var cleanTitle = title.CleanStudioTitle();

            return _studioRepo.FindByTitle(cleanTitle);
        }

        public List<Studio> FindAllByTitle(string title)
        {
            var cleanTitle = title.CleanStudioTitle().ToLower();

            var findAllByTitle = _studioRepo.FindAllByTitle(cleanTitle);
            var alternativeTitles = StudioAliasesToStutioTitle(cleanTitle);

            if (alternativeTitles.Any())
            {
                foreach (var alternativeTitle in alternativeTitles)
                {
                    var findAllByTitleAlternative = _studioRepo.FindAllByTitle(alternativeTitle.CleanStudioTitle().ToLower());
                    if (findAllByTitleAlternative.Any())
                    {
                        findAllByTitle.AddRange(findAllByTitleAlternative);
                    }
                    else
                    {
                        findAllByTitle.Add(new Studio { Title = alternativeTitle, CleanTitle = alternativeTitle.CleanStudioTitle() });
                    }
                }
            }

            return findAllByTitle;
        }

        public Studio FindByForeignId(string foreignId)
        {
            return _studioRepo.FindByForeignId(foreignId);
        }

        public List<string> AllStudioForeignIds()
        {
            return _studioRepo.AllStudioForeignIds();
        }

        public List<string> StudioAliases(string title)
        {
            var studioAliases = new List<string>();

            var aliasList = _aliases.Where(x => x.Value.CleanStudioTitle() == title.CleanStudioTitle()).ToList();

            foreach (var alias in aliasList)
            {
                studioAliases.Add(alias.Key);
            }

            return studioAliases;
        }

        public List<string> StudioAliasesToStutioTitle(string title)
        {
            var studioAliases = new List<string>();

            var aliasList = _aliases.Where(x => x.Key.CleanStudioTitle() == title.CleanStudioTitle()).ToList();

            foreach (var alias in aliasList)
            {
                if (!studioAliases.Contains(alias.Value))
                {
                    studioAliases.Add(alias.Value);
                }
            }

            var reverseAliasList = _aliases.Where(x => x.Value.CleanStudioTitle() == title.CleanStudioTitle()).ToList();

            foreach (var alias in reverseAliasList)
            {
                if (!studioAliases.Contains(alias.Key))
                {
                    studioAliases.Add(alias.Key);
                }
            }

            return studioAliases;
        }
    }
}
