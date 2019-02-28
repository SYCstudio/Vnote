# EarthCup
[HDU5503]

  In the year of 2045,the soccer championship is gradually replaced by Earth Super Soccer Cup(We will call it EarthCup for short later).  
 For one EarthCup,there are $n(n\leq50000)$ soccer teams participated in. Every two teams will have a game. It means that every team will have $n-1$ games with all the other teams.  
 In order to make the result clear, it is ruled that if the two teams of a game have the same score when the game ends.Penalty shootout will last until there is a result.  
 In the EarthCup,every team has a Mark,and will score one point after winning a game and zero after losing a game. The team with the highest mark will be the champion.  
 In the year of 2333, somebody found that some teams had hired hackers to attack and modified the data of the EarthCup for many years.Maybe because of the great amount of the teams, this serious cheating behavior has not been found during hundreds of years.  
 To check whether the data was modified, they started to check the "Mark Table" in the past.  
 But because of the long ages, there were only the final Mark of each team reserved. No one remember the exact result of each game.Now they want to find out some "Mark Table" that must have been modified.  
 "Must have been modified" means we can not get this "Mark Table" by any exact result of each game according to the rules was given by. 

竞赛图判定，有兰道定理：$\sum _ {i=1} ^ k A _ i \ge \binom{k}{2}$，且在 k=n 时必须取等号， $A _ i$ 单调不降。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

typedef long long ll;
const int maxN=50500;

int n;
ll Seq[maxN];

int main(){
    int Case;scanf("%d",&Case);
    while (Case--){
        scanf("%d",&n);for (int i=1;i<=n;i++) scanf("%lld",&Seq[i]);
        sort(&Seq[1],&Seq[n+1]);
        bool flag=1;
        for (ll i=1;i<=n;i++){
            Seq[i]+=Seq[i-1];
            if (Seq[i]<i*(i-1)/2){
                flag=0;break;
            }
        }
        if (Seq[n]!=1ll*n*(n-1)/2) flag=0;
        flag?puts("It seems to have no problem."):puts("The data have been tampered with!");
    }
    return 0;
}
```